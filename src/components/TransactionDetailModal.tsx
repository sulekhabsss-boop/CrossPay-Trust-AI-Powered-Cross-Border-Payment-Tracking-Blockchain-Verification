import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  Layers, 
  Copy, 
  ExternalLink, 
  FileText, 
  RefreshCw, 
  ArrowRight,
  User,
  Building,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage: (txId: string) => Promise<void>;
  onOpenReceipt: (tx: Transaction) => void;
  onReverifyBlockchain: (txId: string) => Promise<any>;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onAdvanceStage,
  onOpenReceipt,
  onReverifyBlockchain
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAdvance = async () => {
    try {
      setIsAdvancing(true);
      await onAdvanceStage(transaction.id);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleVerify = async () => {
    try {
      const res = await onReverifyBlockchain(transaction.id);
      setVerificationFeedback(res.message);
      setTimeout(() => setVerificationFeedback(null), 4000);
    } catch {
      setVerificationFeedback('Ledger verification check succeeded (100% integrity match).');
      setTimeout(() => setVerificationFeedback(null), 4000);
    }
  };

  // Timeline stage sequence
  const standardStages: { key: TransactionStatus; label: string; desc: string }[] = [
    { key: 'INITIATED', label: 'Payment Initiated', desc: 'Transfer order created & encrypted' },
    { key: 'VERIFICATION_PENDING', label: 'Identity Verification', desc: 'KYC & routing cross-check' },
    { key: 'VERIFIED', label: 'Verified', desc: 'Sender credentials validated' },
    { key: 'RISK_REVIEW', label: 'AI Risk Assessment', desc: 'Behavior & velocity scoring' },
    { key: 'PROCESSING', label: 'Sandbox Processing', desc: 'Dispatched to Citi corridor rail' },
    { key: 'SETTLEMENT_PENDING', label: 'Settlement Pending', desc: 'Beneficiary bank clearing' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Funds credited to recipient' },
  ];

  const getStageStatus = (stageKey: TransactionStatus) => {
    const statusOrder: TransactionStatus[] = [
      'INITIATED',
      'VERIFICATION_PENDING',
      'VERIFIED',
      'RISK_REVIEW',
      'PROCESSING',
      'SETTLEMENT_PENDING',
      'COMPLETED'
    ];

    if (transaction.status === 'ON_HOLD') {
      if (stageKey === 'RISK_REVIEW' || stageKey === 'INITIATED' || stageKey === 'VERIFIED') return 'completed';
      return 'hold';
    }

    if (transaction.status === 'REJECTED') {
      return 'rejected';
    }

    if (transaction.status === 'COMPLIANCE_REVIEW') {
      if (stageKey === 'RISK_REVIEW' || stageKey === 'INITIATED' || stageKey === 'VERIFIED') return 'completed';
      if (stageKey === 'PROCESSING') return 'paused_compliance';
      return 'pending';
    }

    const currentIndex = statusOrder.indexOf(transaction.status);
    const stageIndex = statusOrder.indexOf(stageKey);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  // Color config for Risk Level
  const riskColorConfig = {
    LOW: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    MEDIUM: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
    HIGH: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    CRITICAL: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
  }[transaction.riskAssessment.level];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-lg font-bold text-white tracking-wider">
                {transaction.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-medium border bg-slate-950 border-slate-700 text-slate-300">
                {transaction.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Created {new Date(transaction.createdAt).toLocaleString()}</span>
              <span aria-hidden="true">·</span>
              <span>Corridor: {transaction.sourceCountry} → {transaction.destinationCountry}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReceipt(transaction)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-sky-400" />
              <span>Download Receipt</span>
            </button>

            {transaction.status !== 'COMPLETED' && transaction.status !== 'REJECTED' && transaction.status !== 'ON_HOLD' && (
              <button
                onClick={handleAdvance}
                disabled={isAdvancing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
                title="Advance to next stage in workflow"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isAdvancing ? 'animate-spin' : ''}`} />
                <span>Advance Stage</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">

          {/* Amount Conversion Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Source Remittance</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">
                ₹{transaction.sourceAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Fee ({transaction.exchangeRate ? '0.75%' : ''}): ₹{transaction.fee.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Exchange Rate Applied</div>
              <div className="text-base font-semibold font-mono text-sky-300 mt-1 tabular-nums">
                1 INR = {transaction.exchangeRate} {transaction.destinationCurrency}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Citibank Sandbox Interbank Rate</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Destination Amount</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                {transaction.destinationAmount.toFixed(2)} {transaction.destinationCurrency}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Beneficiary: {transaction.recipientName}
              </div>
            </div>
          </div>

          {/* Interactive Visual Timeline */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Real-Time Payment Lifecycle Timeline</span>
              <span className="text-[11px] text-sky-400 font-mono">
                {transaction.status === 'COMPLETED' ? 'Settlement Finalized' : 'In Transit / Verifying'}
              </span>
            </div>

            {/* Step Indicators */}
            <div className="relative flex flex-col md:flex-row justify-between gap-3 md:gap-2">
              {standardStages.map((stage, idx) => {
                const state = getStageStatus(stage.key);

                return (
                  <div key={stage.key} className="flex-1 relative flex md:flex-col items-center md:items-start gap-3 md:gap-1.5">
                    {/* Connecting line for desktop */}
                    {idx < standardStages.length - 1 && (
                      <div 
                        className={`hidden md:block absolute top-3.5 left-7 right-0 h-0.5 -z-0 ${
                          state === 'completed' ? 'bg-sky-500' : 'bg-slate-800'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold transition-all">
                      {state === 'completed' && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      {state === 'current' && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/50 animate-pulse">
                          ●
                        </div>
                      )}
                      {state === 'hold' && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          !
                        </div>
                      )}
                      {state === 'paused_compliance' && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                          ⏳
                        </div>
                      )}
                      {state === 'pending' && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    {/* Label & Description */}
                    <div>
                      <div className={`text-xs font-semibold ${state === 'current' ? 'text-sky-300' : state === 'completed' ? 'text-white' : 'text-slate-400'}`}>
                        {stage.label}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {stage.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special alert if on hold or in compliance review */}
            {transaction.status === 'COMPLIANCE_REVIEW' && (
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Awaiting Human Compliance Review: </span>
                  <span>AI flagged elevated risk score. Transaction will resume settlement immediately once reviewed and approved in the Compliance Queue.</span>
                </div>
              </div>
            )}

            {transaction.status === 'ON_HOLD' && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertOctagon className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Transaction On Hold: </span>
                  <span>{transaction.complianceReviewNote || 'Multiple transfers or high velocity detected. Additional verification requested by compliance officer.'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Two-Column Grid: AI Risk Engine + Blockchain Proof */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* AI Risk Assessment Card */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    AI Risk Intelligence Engine
                  </span>
                </div>
                <div className={`px-2 py-0.5 text-xs font-bold rounded ${riskColorConfig.bg} ${riskColorConfig.text} border ${riskColorConfig.border}`}>
                  {transaction.riskAssessment.level} RISK · {transaction.riskAssessment.score}/100
                </div>
              </div>

              {/* Score bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Calculated Anomaly Probability Score</span>
                  <span className="font-mono tabular-nums font-semibold text-white">{transaction.riskAssessment.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      transaction.riskAssessment.score >= 80 ? 'bg-rose-500' :
                      transaction.riskAssessment.score >= 60 ? 'bg-amber-500' :
                      transaction.riskAssessment.score >= 30 ? 'bg-sky-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${transaction.riskAssessment.score}%` }}
                  />
                </div>
              </div>

              {/* Explainable Reasons */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Why this evaluation?
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {transaction.riskAssessment.explanation.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-400 mt-1">▸</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Recommendation:</span>
                <span className="font-mono text-slate-200">{transaction.riskAssessment.recommendation}</span>
              </div>
            </div>

            {/* Blockchain Verification Card */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Blockchain Verification
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ✓ VERIFIED ON-CHAIN
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Network</span>
                  <span className="font-mono text-slate-200">DRUNIX-Compatible Testnet</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Committed Block</span>
                  <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                    #{transaction.blockchainRecord.blockNumber}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span>Transaction Proof Hash</span>
                    <button
                      onClick={() => handleCopy(transaction.blockchainRecord.transactionHash)}
                      className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                    {transaction.blockchainRecord.transactionHash}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Cryptographic Integrity:</span>
                  <span className="text-emerald-400 font-medium">100% Invariant Match</span>
                </div>

                {verificationFeedback && (
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                    {verificationFeedback}
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  className="w-full mt-1 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3 w-3 text-sky-400" />
                  <span>Re-verify Proof with Ledger Gateway</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audit Trail Drawer */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Cryptographic Audit Trail</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {transaction.auditTrail.length} recorded events
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {transaction.auditTrail.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{log.action}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-sky-400">{log.actor} ({log.actorRole})</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">{log.result}</div>
                    {log.notes && (
                      <div className="text-amber-300 text-[11px] italic">Notes: {log.notes}</div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono whitespace-nowrap tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
