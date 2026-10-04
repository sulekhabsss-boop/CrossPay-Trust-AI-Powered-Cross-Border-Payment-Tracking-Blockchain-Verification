import React, { useState } from 'react';
import { Play, Sparkles, ShieldAlert, AlertOctagon, CheckCircle2, Sliders } from 'lucide-react';
import { Transaction } from '../types';

interface DemoScenarioBarProps {
  onTriggerScenario: (scenarioId: 'scenario_1' | 'scenario_2' | 'scenario_3') => Promise<void>;
  loadingScenario: string | null;
  activeTransactionId?: string;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  onTriggerScenario,
  loadingScenario,
  activeTransactionId
}) => {
  const [speed, setSpeed] = useState<'fast' | 'normal'>('normal');

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Hackathon Challenge Context Badge */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Drunix Hackathon · Citi Track</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden sm:inline">Predefined Evaluation Scenarios:</span>
        </div>

        {/* Middle: 3 Quick Scenario Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario 1 */}
          <button
            onClick={() => onTriggerScenario('scenario_1')}
            disabled={loadingScenario !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all font-medium disabled:opacity-50"
            title="Normal Transfer: ₹25,000 (Low Risk, Auto-Settles)"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Scenario 1: Nominal (₹25k)</span>
          </button>

          {/* Scenario 2 */}
          <button
            onClick={() => onTriggerScenario('scenario_2')}
            disabled={loadingScenario !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all font-medium disabled:opacity-50"
            title="High Value: ₹2,50,000 to UAE (High Risk, pauses for Compliance Officer)"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Scenario 2: High Risk (₹2.5L)</span>
          </button>

          {/* Scenario 3 */}
          <button
            onClick={() => onTriggerScenario('scenario_3')}
            disabled={loadingScenario !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all font-medium disabled:opacity-50"
            title="Rapid Velocity Burst: ₹4,80,000 (Critical Risk, Automated Hold)"
          >
            <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
            <span>Scenario 3: Rapid Velocity (₹4.8L)</span>
          </button>
        </div>

        {/* Right status */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          {loadingScenario ? (
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="animate-spin inline-block h-3 w-3 border-2 border-sky-400 border-t-transparent rounded-full" />
              Initializing test rail...
            </span>
          ) : (
            <span className="hidden md:inline text-slate-400">
              Live Drunix ledger integration enabled · 3s/stage
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
