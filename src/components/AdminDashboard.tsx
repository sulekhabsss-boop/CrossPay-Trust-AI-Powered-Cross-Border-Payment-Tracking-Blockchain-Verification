import React, { useState } from 'react';
import { 
  DashboardMetrics, 
  AuditLog, 
  Transaction, 
  RiskLevel 
} from '../types';
import { 
  SlidersHorizontal, 
  Layers, 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Lock,
  Globe2,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface AdminDashboardProps {
  metrics: DashboardMetrics | null;
  auditLogs: AuditLog[];
  transactions: Transaction[];
  blockchainStats: any;
  onUpdateSettings: (settings: any) => Promise<void>;
  onSelectTransaction: (tx: Transaction) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  auditLogs,
  transactions,
  blockchainStats,
  onUpdateSettings,
  onSelectTransaction
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'ledger' | 'audit' | 'settings'>('metrics');
  const [autoThreshold, setAutoThreshold] = useState(30);
  const [manualThreshold, setManualThreshold] = useState(60);
  const [holdThreshold, setHoldThreshold] = useState(80);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      autoApproveRiskThreshold: autoThreshold,
      manualReviewRiskThreshold: manualThreshold,
      criticalHoldRiskThreshold: holdThreshold
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SlidersHorizontal className="h-6 w-6 text-sky-400" />
            <span>Platform Administration & Ledger Infrastructure</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Devraj Khurana (Super Administrator)</span>
            <span aria-hidden="true">·</span>
            <span>Network: Drunix Enterprise Ledger (Testnet BFT)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">BFT Consensus Synchronized</span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminTab === 'metrics' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metrics & Analytics
          </button>
          <button
            onClick={() => setActiveAdminTab('ledger')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminTab === 'ledger' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drunix Ledger Explorer
          </button>
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminTab === 'audit' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Immutable Audit Trail
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminTab === 'settings' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Thresholds
          </button>
        </div>
      </div>

      {/* METRICS TAB */}
      {activeAdminTab === 'metrics' && metrics && (
        <div className="space-y-6">
          {/* Pitch-Friendly KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Transactions</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {metrics.totalTransactions}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Synthetic demo records</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Remittance Volume</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
                ₹{(metrics.totalVolumeINR / 100000).toFixed(1)}L
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">₹{metrics.totalVolumeINR.toLocaleString('en-IN')}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Average Speed</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {metrics.averageProcessingTimeMin}m
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Citi straight-through</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Completion Rate</div>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
                {metrics.completionRatePercent}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Nominal settlement</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">High Risk Rate</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {metrics.flaggedTransactions}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Requires compliance</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400">Ledger Integrity</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                100%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero proof discrepancies</div>
            </div>
          </div>

          {/* Corridor & Risk Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Corridors breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Global Remittance Corridors (Outbound from India)
                </span>
                <span className="text-[11px] font-mono text-sky-400">Live Rails</span>
              </div>
              <div className="space-y-3">
                {metrics.corridorBreakdown.map((item) => (
                  <div key={item.corridor} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-200">{item.corridor}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {item.count} transfers · ₹{item.volume.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${Math.min(100, (item.volume / metrics.totalVolumeINR) * 100 * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk profile distribution */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  AI Risk Engine Score Distribution
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Zero Autonomous Freezes</span>
              </div>
              <div className="space-y-3">
                {metrics.riskBreakdown.map((r) => {
                  const barColor = 
                    r.level === 'CRITICAL' ? 'bg-rose-500' :
                    r.level === 'HIGH' ? 'bg-amber-500' :
                    r.level === 'MEDIUM' ? 'bg-sky-500' : 'bg-emerald-500';

                  return (
                    <div key={r.level} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-200">{r.level} Risk Tier</span>
                        <span className="font-mono text-slate-400 tabular-nums">{r.count} transactions</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${barColor} rounded-full`}
                          style={{ width: `${Math.min(100, (r.count / metrics.totalTransactions) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRUNIX LEDGER EXPLORER TAB */}
      {activeAdminTab === 'ledger' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <span>Drunix Enterprise Blockchain Ledger Proofs</span>
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Simulated Proof-of-Authority (BFT) consensus tracking off-chain remittance integrity state roots.
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-3">
              <span>Contract: <strong className="text-sky-400">0x71C8...79B8</strong></span>
              <span>·</span>
              <span>Latest Block: <strong className="text-emerald-400">#{blockchainStats?.latestBlock || 104932}</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="pb-3 pl-2">Block #</th>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Proof Hash (SHA-256)</th>
                  <th className="pb-3">Merkle Root Proof</th>
                  <th className="pb-3">Committed State</th>
                  <th className="pb-3 text-right pr-2">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {transactions.slice(0, 15).map((tx) => (
                  <tr 
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="py-3 pl-2 font-bold text-emerald-400">
                      #{tx.blockchainRecord.blockNumber}
                    </td>
                    <td className="py-3 text-white font-semibold">
                      {tx.id}
                    </td>
                    <td className="py-3 text-[11px] text-slate-400 break-all max-w-xs truncate">
                      {tx.blockchainRecord.transactionHash}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500 break-all max-w-xs truncate">
                      {tx.blockchainRecord.merkleProof}
                    </td>
                    <td className="py-3 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2 text-emerald-400 font-semibold">
                      ✓ Invariant Match
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IMMUTABLE AUDIT TRAIL TAB */}
      {activeAdminTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Irrevocable Regulatory Audit Trail</h3>
              <div className="text-xs text-slate-400">
                Every state transition, AI risk evaluation, and human compliance action logged with cryptographic actor ID.
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{auditLogs.length} total events</span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {auditLogs.slice(0, 30).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-sky-400">{log.transactionId}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">By {log.actor} ({log.actorRole})</span>
                  </div>
                  <div className="text-slate-300">{log.result}</div>
                  {log.notes && (
                    <div className="text-amber-300 italic text-[11px]">Notes: {log.notes}</div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RISK THRESHOLD CONFIGURATION TAB */}
      {activeAdminTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">System Risk Threshold Governance</h3>
            <div className="text-xs text-slate-400">
              Tune AI anomaly scoring sensitivity boundaries for retail and commercial remittance queues.
            </div>
          </div>

          {settingsSaved && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              ✓ Risk threshold configuration updated and broadcast to AI engine.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-200">
                <span>Straight-Through Auto-Approve Ceiling</span>
                <span className="font-mono text-emerald-400">Score &lt; {autoThreshold}</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={autoThreshold}
                onChange={(e) => setAutoThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-[11px] text-slate-500 mt-0.5">
                Transactions scoring below this proceed immediately to Citi settlement without human pause.
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-200">
                <span>Mandatory Compliance Review Threshold</span>
                <span className="font-mono text-amber-400">Score ≥ {manualThreshold}</span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={manualThreshold}
                onChange={(e) => setManualThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-[11px] text-slate-500 mt-0.5">
                Transactions reaching this score are paused and placed into the officer review queue.
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-200">
                <span>Investigative Critical Hold Threshold</span>
                <span className="font-mono text-rose-400">Score ≥ {holdThreshold}</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={holdThreshold}
                onChange={(e) => setHoldThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-[11px] text-slate-500 mt-0.5">
                Transactions with extreme risk automatically engage transfer hold until secondary KYC is supplied.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors shadow-md"
              >
                Apply Threshold Policies
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
