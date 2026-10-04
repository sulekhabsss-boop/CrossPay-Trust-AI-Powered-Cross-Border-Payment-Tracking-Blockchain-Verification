import React, { useState, useMemo } from 'react';
import { 
  Transaction, 
  DashboardMetrics, 
  CorridorRate,
  RiskLevel 
} from '../types';
import { 
  Send, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  Globe2,
  ExternalLink
} from 'lucide-react';

interface SenderDashboardProps {
  transactions: Transaction[];
  metrics: DashboardMetrics | null;
  onOpenSendModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  corridors: CorridorRate[];
}

export const SenderDashboard: React.FC<SenderDashboardProps> = ({
  transactions,
  metrics,
  onOpenSendModal,
  onSelectTransaction,
  corridors
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.purpose.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'ACTIVE') return !['COMPLETED', 'REJECTED', 'ON_HOLD'].includes(tx.status);
      if (statusFilter === 'COMPLETED') return tx.status === 'COMPLETED';
      if (statusFilter === 'FLAGGED') return tx.riskAssessment.level === 'HIGH' || tx.riskAssessment.level === 'CRITICAL' || tx.status === 'ON_HOLD';
      return true;
    });
  }, [transactions, searchTerm, statusFilter]);

  // Total sent by current sender
  const totalSentINR = transactions.reduce((sum, t) => sum + t.sourceAmount, 0);
  const activeCount = transactions.filter(t => !['COMPLETED', 'REJECTED', 'ON_HOLD'].includes(t.status)).length;
  const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sender Dashboard</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Aarav Mehta (Retail Remitter)</span>
            <span aria-hidden="true">·</span>
            <span>Origin Account: State Bank of India</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">KYC Tier 1 Verified</span>
          </div>
        </div>

        <button
          onClick={onOpenSendModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Send className="h-4 w-4" />
          <span>Send Money Internationally</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Sent (YTD)</span>
            <TrendingUp className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            ₹{totalSentINR.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 7 global banking corridors</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Transfers In Flight</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Real-time state tracking engaged</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed Transfers</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">100% On-chain ledger proofs mint</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Speed</span>
            <Globe2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            {metrics ? `${metrics.averageProcessingTimeMin} min` : '4.8 min'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Straight-through settlement target</div>
        </div>
      </div>

      {/* Available Corridors Horizontal Ticker */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Live Corridor Rates & Liquidity Rails (Citi Sandbox)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {corridors.map((c) => (
            <div key={c.code} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span>{c.flag}</span>
                <span>{c.code} ({c.currency})</span>
              </div>
              <div className="font-mono text-sky-400 font-semibold text-[11px] tabular-nums">
                1 INR = {c.rate}
              </div>
              <div className="text-[10px] text-slate-500">~{c.estimatedMinutes}m · {c.feePercent}% fee</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Your Remittance Records</h3>
            <div className="text-xs text-slate-400">
              Select any transfer to inspect live timeline, explainable risk score, and Drunix blockchain verification.
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction ID, recipient..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-56"
              />
            </div>

            {/* Segmented status buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${statusFilter === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-2.5 py-1 rounded-md transition-colors ${statusFilter === 'ACTIVE' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                In Flight
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-md transition-colors ${statusFilter === 'COMPLETED' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('FLAGGED')}
                className={`px-2.5 py-1 rounded-md transition-colors ${statusFilter === 'FLAGGED' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                Flagged / Review
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Beneficiary</th>
                <th className="pb-3">Corridor</th>
                <th className="pb-3 text-right">Amount (INR)</th>
                <th className="pb-3 text-right">Settled Amount</th>
                <th className="pb-3">AI Risk Score</th>
                <th className="pb-3">Lifecycle Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No transactions match your search filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const riskLevel = tx.riskAssessment.level;
                  const riskColor = 
                    riskLevel === 'CRITICAL' ? 'text-rose-400' :
                    riskLevel === 'HIGH' ? 'text-amber-400' :
                    riskLevel === 'MEDIUM' ? 'text-sky-400' : 'text-emerald-400';

                  const isComplete = tx.status === 'COMPLETED';
                  const isHold = tx.status === 'ON_HOLD' || tx.status === 'COMPLIANCE_REVIEW';

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
                        <div className="text-white">{tx.recipientName}</div>
                        <div className="text-[11px] text-slate-500">{tx.recipientBank}</div>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-200">{tx.destinationCountry.split(' ')[0]}</span>
                        <span className="text-[11px] text-slate-500 ml-1">({tx.destinationCurrency})</span>
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-white">
                        ₹{tx.sourceAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-sky-400">
                        {tx.destinationAmount.toFixed(2)} {tx.destinationCurrency}
                      </td>
                      <td className="py-3">
                        <span className={`font-mono font-bold ${riskColor} tabular-nums`}>
                          {tx.riskAssessment.score}/100
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          {tx.riskAssessment.level}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${
                          isComplete ? 'text-emerald-400' :
                          isHold ? 'text-amber-400' : 'text-sky-300'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            isComplete ? 'bg-emerald-400' :
                            isHold ? 'bg-amber-400' : 'bg-sky-400 animate-pulse'
                          }`} />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-slate-400 font-mono">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTransaction(tx);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs transition-colors"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
