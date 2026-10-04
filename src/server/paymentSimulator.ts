import { Transaction, TransactionStatus, AuditLog } from '../types';
import { db } from './db';
import { blockchainService } from './blockchainService';

// Ordered state transitions for standard successful flow
export const WORKFLOW_STAGES: TransactionStatus[] = [
  'INITIATED',
  'VERIFICATION_PENDING',
  'VERIFIED',
  'RISK_REVIEW',
  'PROCESSING',
  'SETTLEMENT_PENDING',
  'COMPLETED'
];

class PaymentSimulationEngine {
  private activeSimulations: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Advances a transaction to the next logical state.
   */
  public advanceTransaction(txId: string): Transaction | null {
    const tx = db.transactions.get(txId);
    if (!tx) return null;

    if (tx.status === 'COMPLETED' || tx.status === 'REJECTED' || tx.status === 'ON_HOLD') {
      this.stopSimulation(txId);
      return tx;
    }

    let nextStatus: TransactionStatus;
    let auditNote = '';

    switch (tx.status) {
      case 'INITIATED':
        nextStatus = 'VERIFICATION_PENDING';
        auditNote = 'Sender KYC credentials submitted to identity verification node';
        break;
      case 'VERIFICATION_PENDING':
        nextStatus = 'VERIFIED';
        auditNote = 'Sender KYC & recipient account routing validated';
        break;
      case 'VERIFIED':
        nextStatus = 'RISK_REVIEW';
        auditNote = `AI Risk Engine scoring calculated: ${tx.riskAssessment.score}/100`;
        break;
      case 'RISK_REVIEW':
        // If High or Critical risk, route to Compliance Review rather than directly to Processing!
        if (tx.riskAssessment.level === 'HIGH') {
          nextStatus = 'COMPLIANCE_REVIEW';
          auditNote = 'AI flagged elevated risk score; routed to human Compliance Officer review queue';
        } else if (tx.riskAssessment.level === 'CRITICAL') {
          nextStatus = 'ON_HOLD';
          auditNote = 'AI flagged critical risk score; automated transfer hold engaged pending officer interview';
        } else {
          nextStatus = 'PROCESSING';
          auditNote = 'Risk assessment passed nominal threshold; dispatched to Citi sandbox corridor rail';
        }
        break;
      case 'COMPLIANCE_REVIEW':
        // Compliance review requires human intervention unless explicitly auto-approved in sandbox
        return tx;
      case 'PROCESSING':
        nextStatus = 'SETTLEMENT_PENDING';
        auditNote = 'Liquidity reserve locked; settlement message relayed to recipient depository bank';
        break;
      case 'SETTLEMENT_PENDING':
        nextStatus = 'COMPLETED';
        auditNote = 'Settlement confirmed by correspondent bank. Funds available to recipient.';
        tx.completedAt = new Date().toISOString();
        break;
      default:
        return tx;
    }

    const timestamp = new Date().toISOString();
    tx.status = nextStatus;
    tx.updatedAt = timestamp;
    tx.statusHistory.push({
      status: nextStatus,
      timestamp,
      note: auditNote
    });

    // Update on-chain proof
    blockchainService.updateTransactionStatus(txId, nextStatus, auditNote);

    // Create Audit Log
    const auditRecord: AuditLog = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp,
      actor: nextStatus === 'RISK_REVIEW' ? 'AI Risk Engine' : nextStatus === 'SETTLEMENT_PENDING' ? 'Citi Settlement Rail' : 'CrossPay Workflow Engine',
      actorRole: 'admin',
      action: `STATUS_UPDATED_${nextStatus}`,
      transactionId: txId,
      result: auditNote
    };

    tx.auditTrail.push(auditRecord);
    db.auditLogs.unshift(auditRecord);

    // Issue Notification on completion
    if (nextStatus === 'COMPLETED') {
      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: tx.senderId,
        transactionId: tx.id,
        title: 'Payment Completed Successfully',
        message: `Your remittance ${tx.id} of ₹${tx.sourceAmount.toLocaleString('en-IN')} has been settled to ${tx.recipientName}.`,
        type: 'SUCCESS',
        read: false,
        timestamp
      });
      this.stopSimulation(txId);
    }

    return tx;
  }

  /**
   * Starts automatic demo progression (e.g. 3 seconds per step)
   */
  public startDemoSimulation(txId: string, speedSeconds = 3) {
    this.stopSimulation(txId);

    const interval = setInterval(() => {
      const updated = this.advanceTransaction(txId);
      if (!updated || updated.status === 'COMPLETED' || updated.status === 'ON_HOLD' || updated.status === 'COMPLIANCE_REVIEW' || updated.status === 'REJECTED') {
        this.stopSimulation(txId);
      }
    }, speedSeconds * 1000);

    this.activeSimulations.set(txId, interval);
  }

  public stopSimulation(txId: string) {
    const existing = this.activeSimulations.get(txId);
    if (existing) {
      clearInterval(existing);
      this.activeSimulations.delete(txId);
    }
  }

  public isSimulating(txId: string): boolean {
    return this.activeSimulations.has(txId);
  }
}

export const paymentSimulator = new PaymentSimulationEngine();
