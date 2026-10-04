import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Eye, 
  Clock, 
  HelpCircle, 
  CheckCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

interface HeroLandingProps {
  onOpenSendModal: () => void;
  onSelectTab: (tab: 'overview' | 'send' | 'compliance' | 'ledger' | 'docs') => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onOpenSendModal, onSelectTab }) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 pt-8 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Challenge Kicker */}
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-3">
          <span>Drunix Hackathon in collaboration with Citi</span>
          <span aria-hidden="true">·</span>
          <span>Challenge: Build the Future of Payments in India</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Column */}
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Smarter Payments. <br />
              Trusted Transactions. <br />
              <span className="text-sky-400">Complete Visibility.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              CrossPay Trust combines explainable AI risk intelligence with blockchain-backed auditability to eliminate the cross-border black box. Know exactly where your payment is, why it is evaluated, and when it settles.
            </p>

            {/* Principles summary */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-white">Governing Fintech Principle:</span>
              <p className="text-slate-400">
                “AI provides intelligence. Blockchain provides trust. The payment rail provides execution. Humans and policies remain in control of high-risk decisions.”
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSendModal}
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2"
              >
                <span>Initiate Remittance Sandbox</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onSelectTab('compliance')}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Open Compliance Queue</span>
              </button>

              <button
                onClick={() => onSelectTab('ledger')}
                className="px-4 py-2.5 rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors"
              >
                Inspect Ledger Proofs →
              </button>
            </div>
          </div>

          {/* Key Differentiator Comparison Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md">
              <div className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>The Remittance Experience Gap</span>
                <span className="text-[10px] text-sky-400 lowercase font-mono">Citi Track Solution</span>
              </div>

              {/* Legacy Black Box */}
              <div className="mb-4 rounded-xl border border-rose-950/60 bg-rose-950/20 p-3.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-rose-400 mb-1.5">
                  <HelpCircle className="h-4 w-4" />
                  <span>Legacy Cross-Border Remittance (Black Box)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-1">
                  <span>Send Money</span>
                  <span>→</span>
                  <span className="text-rose-300">Days of Silence</span>
                  <span>→</span>
                  <span className="text-slate-500">Unexplained Delays</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 leading-normal">
                  Senders have zero visibility into intermediary hops, AML review holds, or FX margin fee cuts.
                </p>
              </div>

              {/* CrossPay Trust Transparent Architecture */}
              <div className="rounded-xl border border-sky-900/60 bg-sky-950/30 p-3.5 text-xs">
                <div className="flex items-center gap-2 font-semibold text-sky-400 mb-2">
                  <CheckCircle className="h-4 w-4 text-sky-400" />
                  <span>CrossPay Trust (Transparent & Cryptographic)</span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono py-1">
                  <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                    1. Initiate
                  </div>
                  <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-sky-300">
                    2. AI Risk
                  </div>
                  <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-emerald-300">
                    3. Drunix
                  </div>
                  <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-indigo-300">
                    4. Settled
                  </div>
                </div>

                <ul className="mt-2.5 space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Real-time state machine with verifiable timestamps</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>Explainable AI risk scoring (no black-box rejections)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>Immutable Drunix ledger proof with SHA-256 Merkle root</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>Sensitive PII held strictly off-chain</span>
                </span>
                <span className="font-mono text-slate-400">Citi Sandbox Rail</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
