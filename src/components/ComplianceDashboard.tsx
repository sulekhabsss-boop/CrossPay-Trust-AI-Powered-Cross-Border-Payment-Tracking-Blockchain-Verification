import React, { useState } from 'react';
import { Transaction, RiskLevel } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  FileText, 
  XOctagon, 
  PauseCircle,
  HelpCircle,
  FileCheck2,
  Filter
} from 'lucide-react';

interface ComplianceDashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onApproveTransaction: (txId: string, notes?: string) => Promise<void>;
  onHoldTransaction: (txId: string, notes?: string) => Promise<void>;
  onRequestVerification: (txId: string, notes?: string) => Promise<void>;
  onRejectTransaction: (txId: string, notes?: string) => Promise<void>;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  transactions,
  onSelectTransaction,
  onApproveTransaction,
  onHoldTransaction,
  onRequestVerification,
  onRejectTransaction
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'pending' | 'high' | 'all'>('pending');
  const [selectedTxForAction, setSelectedTxForAction] = useState<Transaction | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'hold' | 'verify' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Filter queues
  const pendingReviews = transactions.filter(t => t.status === 'COMPLIANCE_REVIEW' || t.status === 'ON_HOLD');
  const highRiskTxs = transactions.filter(t => t.riskAssessment.level === 'HIGH' || t.riskAssessment.level === 'CRITICAL');
  
  const displayedTxs = activeQueueTab === 'pending' ? pendingReviews : activeQueueTab === 'high' ? highRiskTxs : transactions;

  const handleOpenActionModal = (tx: Transaction, type: 'approve' | 'hold' | 'verify' | 'reject', e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTxForAction(tx);
    setActionType(type);
    setActionNotes(
      type === 'approve' ? 'Identity documentation and origin of wealth verified in compliance check.' :
      type === 'hold' ? 'High velocity / value discrepancy flagged. Placed on investigative hold.' :
      type === 'verify' ? 'Requested supplemental source-of-funds invoice and KYC update.' :
      'Failed anti-money laundering threshold standards.'
    );
  };

  const handleExecuteAction = async () => {
    if (!selectedTxForAction || !actionType) return;
    try {
      setIsSubmittingAction(true);
      if (actionType === 'approve') {
        await onApproveTransaction(selectedTxForAction.id, actionNotes);
      } else if (actionType === 'hold') {
        await onHoldTransaction(selectedTxForAction.id, actionNotes);
      } else if (actionType === 'verify') {
        await onRequestVerification(selectedTxForAction.id, actionNotes);
      } else if (actionType === 'reject') {
        await onRejectTransaction(selectedTxForAction.id, actionNotes);
      }
      setSelectedTxForAction(null);
      setActionType(null);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-sky-400" />
            <span>Compliance & Risk Intelligence Portal</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Vikram Sengupta (Lead Compliance Officer)</span>
            <span aria-hidden="true">·</span>
            <span>AML / KYC Oversight Console</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Human-in-the-Loop Governance Active</span>
          </div>
        </div>

        {/* Queue filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveQueueTab('pending')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeQueueTab === 'pending' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Reviews ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveQueueTab('high')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeQueueTab === 'high' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            High & Critical Risk ({highRiskTxs.length})
          </button>
          <button
            onClick={() => setActiveQueueTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeQueueTab === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Transactions ({transactions.length})
          </button>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white">Compliance Protocol Notice:</span>
          <p className="text-slate-400">
            Per CrossPay Trust ethical governance standards: AI risk scores provide objective anomaly detection and explainability, but never autonomously freeze or seize funds. As Compliance Officer, your decision establishes an irrevocable cryptographically signed audit trail.
          </p>
        </div>
      </div>

      {/* Main Review Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {activeQueueTab === 'pending' ? 'Pending Compliance Review Queue' : activeQueueTab === 'high' ? 'High Risk Transaction Log' : 'All Ledger Entries'}
          </h3>
          <div className="text-xs text-slate-400">
            Click any row to view granular feature weights, velocity graphs, and on-chain proofs.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Sender / Origin</th>
                <th className="pb-3">Beneficiary / Corridor</th>
                <th className="pb-3 text-right">Amount (INR)</th>
                <th className="pb-3">Risk Assessment</th>
                <th className="pb-3">Primary Anomaly Factor</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Officer Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {displayedTxs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No transactions currently pending in this queue.
                  </td>
                </tr>
              ) : (
                displayedTxs.map((tx) => {
                  const riskLevel = tx.riskAssessment.level;
                  const isHigh = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
                  const riskColor = 
                    riskLevel === 'CRITICAL' ? 'text-rose-400' :
                    riskLevel === 'HIGH' ? 'text-amber-400' :
                    riskLevel === 'MEDIUM' ? 'text-sky-400' : 'text-emerald-400';

                  const primaryFactor = tx.riskAssessment.factors[0]?.description || tx.riskAssessment.explanation[0] || 'Nominal baseline';

                  return (
                    <tr 
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pl-2 font-mono text-white font-semibold">
                        {tx.id}
                      </td>
                      <td className="py-3.5">
                        <div className="text-white">{tx.senderName}</div>
                        <div className="text-[11px] text-slate-500">{tx.sourceCountry}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="text-white">{tx.recipientName}</div>
                        <div className="text-[11px] text-slate-500">{tx.destinationCountry} ({tx.destinationCurrency})</div>
                      </td>
                      <td className="py-3.5 text-right font-mono tabular-nums text-white text-sm">
                        ₹{tx.sourceAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5">
                        <div className={`font-mono font-bold ${riskColor} tabular-nums text-sm`}>
                          {tx.riskAssessment.score}/100
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tx.riskAssessment.level} Risk
                        </div>
                      </td>
                      <td className="py-3.5 max-w-xs">
                        <div className="text-slate-300 text-[11px] line-clamp-2">
                          {primaryFactor}
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded ${
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.status === 'ON_HOLD' ? 'bg-rose-500/10 text-rose-400' :
                          tx.status === 'COMPLIANCE_REVIEW' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleOpenActionModal(tx, 'approve', e)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                            title="Approve for immediate Citi rail processing"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => handleOpenActionModal(tx, 'hold', e)}
                            className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-600/40 text-xs transition-colors"
                            title="Place on compliance hold"
                          >
                            Hold
                          </button>
                          <button
                            onClick={(e) => handleOpenActionModal(tx, 'verify', e)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs transition-colors"
                            title="Request supplementary KYC"
                          >
                            Verify
                          </button>
                          <button
                            onClick={(e) => handleOpenActionModal(tx, 'reject', e)}
                            className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 text-xs transition-colors"
                            title="Reject transaction"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Review Modal */}
      {selectedTxForAction && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              <span>
                {actionType === 'approve' && 'Approve Transfer for Settlement'}
                {actionType === 'hold' && 'Place Transaction On Hold'}
                {actionType === 'verify' && 'Request Supplemental Verification'}
                {actionType === 'reject' && 'Reject Suspicious Remittance'}
              </span>
            </h3>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="font-mono text-white font-bold">{selectedTxForAction.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Remittance Amount:</span>
                <span className="font-mono text-white">₹{selectedTxForAction.sourceAmount.toLocaleString('en-IN')} INR</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AI Risk Score:</span>
                <span className="font-mono text-amber-400 font-bold">{selectedTxForAction.riskAssessment.score}/100 ({selectedTxForAction.riskAssessment.level})</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Compliance Notes (Committed to Immutable Audit Trail)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                placeholder="Enter justification notes for regulatory audit..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setSelectedTxForAction(null); setActionType(null); }}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isSubmittingAction}
                className={`px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition-all ${
                  actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  actionType === 'hold' ? 'bg-amber-600 hover:bg-amber-500' :
                  actionType === 'verify' ? 'bg-sky-600 hover:bg-sky-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isSubmittingAction ? 'Recording Audit Proof...' : 'Commit Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
