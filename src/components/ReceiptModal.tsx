import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Transaction } from '../types';

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textData = `
======================================================
CROSSPAY TRUST — OFFICIAL REMITTANCE RECEIPT
Smarter Payments. Trusted Transactions. Complete Visibility.
Drunix Hackathon · Citi Track
======================================================

Transaction ID:     ${transaction.id}
Date & Time:        ${new Date(transaction.createdAt).toLocaleString()}
Status:             ${transaction.status}

SENDER INFORMATION:
Name:               ${transaction.senderName}
Email:              ${transaction.senderEmail}
Country:            ${transaction.sourceCountry}

RECIPIENT INFORMATION:
Beneficiary:        ${transaction.recipientName}
Email:              ${transaction.recipientEmail}
Depository Bank:    ${transaction.recipientBank}
Account (Last 4):   **** ${transaction.recipientAccountLast4}
Country:            ${transaction.destinationCountry}

FINANCIAL BREAKDOWN:
Source Remittance:  ₹${transaction.sourceAmount.toLocaleString('en-IN')} INR
Network Fee:        ₹${transaction.fee.toLocaleString('en-IN')} INR
Exchange Rate:      1 INR = ${transaction.exchangeRate} ${transaction.destinationCurrency}
Settled Amount:     ${transaction.destinationAmount.toFixed(2)} ${transaction.destinationCurrency}

INTELLIGENCE & TRUST LAYER:
AI Risk Assessment: ${transaction.riskAssessment.score}/100 (${transaction.riskAssessment.level})
Blockchain Network: ${transaction.blockchainRecord.network}
Committed Block:    #${transaction.blockchainRecord.blockNumber}
Transaction Hash:   ${transaction.blockchainRecord.transactionHash}
Ledger Integrity:   VERIFIED

This transaction was recorded in the Citi Prototype Sandbox Rail.
======================================================
`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CrossPay-Receipt-${transaction.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Actions row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Text</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt Printable Canvas */}
        <div className="mt-4 space-y-6 print:m-0 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-sky-600" />
                <span>CROSSPAY TRUST</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Citi Hackathon Track · International Remittance Receipt
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800">
                {transaction.status}
              </span>
              <div className="font-mono text-xs text-slate-500 mt-1">
                Ref: {transaction.id}
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Source Remittance</div>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ₹{transaction.sourceAmount.toLocaleString('en-IN')} INR
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Settled to Beneficiary</div>
              <div className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
                {transaction.destinationAmount.toFixed(2)} {transaction.destinationCurrency}
              </div>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Sender (Origin)</div>
              <div className="font-semibold text-slate-800">{transaction.senderName}</div>
              <div className="text-slate-500 font-mono">{transaction.senderEmail}</div>
              <div className="text-slate-500">{transaction.sourceCountry} (INR)</div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Beneficiary (Destination)</div>
              <div className="font-semibold text-slate-800">{transaction.recipientName}</div>
              <div className="text-slate-500 font-mono">{transaction.recipientEmail}</div>
              <div className="text-slate-500">{transaction.recipientBank} (•••• {transaction.recipientAccountLast4})</div>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Applied Exchange Rate</span>
              <span className="font-mono tabular-nums font-semibold">1 INR = {transaction.exchangeRate} {transaction.destinationCurrency}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Transparent Rail Fee</span>
              <span className="font-mono tabular-nums">₹{transaction.fee.toLocaleString('en-IN')} INR</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Purpose</span>
              <span>{transaction.purpose}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Execution Timestamp</span>
              <span className="font-mono">{new Date(transaction.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-sky-900">
              <span>Drunix Blockchain Proof Verification</span>
              <span className="text-emerald-700">✓ Invariant Confirmed</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 break-all">
              TxHash: {transaction.blockchainRecord.transactionHash}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Block #{transaction.blockchainRecord.blockNumber}</span>
              <span>AI Risk Score: {transaction.riskAssessment.score}/100 ({transaction.riskAssessment.level})</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
            Citi Track Prototype · Simulated sandbox clearing message for evaluation purposes only.
          </div>
        </div>
      </div>
    </div>
  );
};
