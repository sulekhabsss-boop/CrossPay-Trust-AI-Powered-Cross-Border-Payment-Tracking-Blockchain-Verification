import React from 'react';
import { Transaction } from '../types';
import { UserCheck, CheckCircle2, Clock, FileText, ExternalLink, ShieldCheck, ArrowDownLeft } from 'lucide-react';

interface RecipientDashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenReceipt: (tx: Transaction) => void;
}

export const RecipientDashboard: React.FC<RecipientDashboardProps> = ({
  transactions,
  onSelectTransaction,
  onOpenReceipt
}) => {
  // Filter transactions relevant for recipient Sophia Miller
  const incoming = transactions.filter(
    t => t.recipientName.includes('Sophia') || t.recipientEmail.includes('recipient') || t.status === 'COMPLETED'
  );

  const completedIncoming = incoming.filter(t => t.status === 'COMPLETED');
  const pendingIncoming = incoming.filter(t => t.status !== 'COMPLETED');

  const totalReceivedUSD = completedIncoming.reduce((sum, t) => sum + (t.destinationCurrency === 'USD' ? t.destinationAmount : 0), 0);

  return (
    <div className="space-y-8">
      {/* Recipient Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Recipient Portal</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Sophia Miller (Beneficiary)</span>
            <span aria-hidden="true">·</span>
            <span>Bank: Citibank N.A. New York (Account: •••• 4928)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Auto-Credit Active</span>
          </div>
        </div>
      </div>

      {/* Recipient KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Inbound Credited</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            ${totalReceivedUSD.toFixed(2)} USD
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct wire to Citibank account</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Inbound Transfers</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
            {pendingIncoming.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Under AML clearance / settlement</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Drunix Verification Status</span>
            <ShieldCheck className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            100% Verified
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tamper-resistant cryptographic ledger</div>
        </div>
      </div>

      {/* Incoming Transactions Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Incoming Remittances & Wire Status</h3>
          <div className="text-xs text-slate-400">
            Real-time tracking of inward remittances sent from India via Citi Sandbox Rail.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Sender (Origin)</th>
                <th className="pb-3">Source Amount</th>
                <th className="pb-3 text-right">You Receive</th>
                <th className="pb-3">Current Status</th>
                <th className="pb-3">Blockchain Proof</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {incoming.map((tx) => {
                const isComplete = tx.status === 'COMPLETED';
                return (
                  <tr 
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pl-2 font-mono text-white font-semibold">
                      {tx.id}
                    </td>
                    <td className="py-3">
                      <div className="text-white">{tx.senderName}</div>
                      <div className="text-[11px] text-slate-500">{tx.sourceCountry} (INR)</div>
                    </td>
                    <td className="py-3 font-mono tabular-nums text-slate-400">
                      ₹{tx.sourceAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-emerald-400 font-bold text-sm">
                      {tx.destinationAmount.toFixed(2)} {tx.destinationCurrency}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${
                        isComplete ? 'text-emerald-400' : 'text-sky-300'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-sky-400 animate-pulse'}`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-400">
                      Block #{tx.blockchainRecord.blockNumber}
                    </td>
                    <td className="py-3 text-right pr-2 space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReceipt(tx);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors inline-flex items-center gap-1"
                        title="Download official receipt"
                      >
                        <FileText className="h-3 w-3 text-sky-400" />
                        <span>Receipt</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        className="px-2 py-1 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 text-xs transition-colors"
                      >
                        Track →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
