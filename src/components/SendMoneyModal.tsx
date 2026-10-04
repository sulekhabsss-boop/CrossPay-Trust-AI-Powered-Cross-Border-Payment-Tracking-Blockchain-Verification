import React, { useState, useMemo } from 'react';
import { 
  X, 
  Send, 
  ArrowRight, 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Percent,
  Coins
} from 'lucide-react';
import { CorridorRate, Transaction } from '../types';
import confetti from 'canvas-confetti';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridors: CorridorRate[];
  onTransactionCreated: (tx: Transaction) => void;
  apiCreateTransaction: (data: any) => Promise<{ transaction: Transaction; message: string }>;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  corridors,
  onTransactionCreated,
  apiCreateTransaction
}) => {
  const [sourceAmount, setSourceAmount] = useState<string>('50000');
  const [selectedCorridorCode, setSelectedCorridorCode] = useState<string>('US');
  const [recipientName, setRecipientName] = useState<string>('Sophia Miller');
  const [recipientEmail, setRecipientEmail] = useState<string>('recipient@crosspay.demo');
  const [recipientBank, setRecipientBank] = useState<string>('Citibank N.A. (New York)');
  const [recipientAccountLast4, setRecipientAccountLast4] = useState<string>('4928');
  const [purpose, setPurpose] = useState<string>('Family Support & Living Expenses');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCorridor = useMemo(() => {
    return corridors.find(c => c.code === selectedCorridorCode) || corridors[0] || {
      code: 'US',
      country: 'United States',
      currency: 'USD',
      flag: '🇺🇸',
      rate: 0.0118,
      feePercent: 0.75,
      estimatedMinutes: 8
    };
  }, [corridors, selectedCorridorCode]);

  // Calculations
  const numericAmount = parseFloat(sourceAmount) || 0;
  const feeAmount = Math.round(numericAmount * (selectedCorridor.feePercent / 100));
  const netAmountINR = Math.max(0, numericAmount - feeAmount);
  const destinationAmount = (netAmountINR * selectedCorridor.rate).toFixed(2);

  // Pre-scoring heuristic preview
  const estimatedRiskLevel = useMemo(() => {
    if (numericAmount > 400000) return { label: 'CRITICAL', color: 'text-rose-400', bg: 'bg-rose-500/10' };
    if (numericAmount > 200000) return { label: 'HIGH', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (numericAmount > 75000) return { label: 'MEDIUM', color: 'text-sky-400', bg: 'bg-sky-500/10' };
    return { label: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  }, [numericAmount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numericAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount above ₹0.');
      return;
    }
    if (!recipientName.trim() || !recipientEmail.trim()) {
      setErrorMessage('Please provide the recipient’s full name and email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiCreateTransaction({
        sourceAmount: numericAmount,
        destinationCountryCode: selectedCorridor.code,
        recipientName,
        recipientEmail,
        recipientBank,
        recipientAccountLast4,
        purpose,
        autoSimulate: true
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });

      onTransactionCreated(res.transaction);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 my-8 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Initiate Cross-Border Remittance</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Origin: India (INR)</span>
              <span aria-hidden="true">·</span>
              <span>Citi Sandbox Rail</span>
              <span aria-hidden="true">·</span>
              <span>Drunix Ledger Proof</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Transfer Amount & Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                You Send (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-base focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 tabular-nums"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                <span>Preset:</span>
                <button type="button" onClick={() => setSourceAmount('25000')} className="hover:text-white underline">₹25k</button>
                <span>·</span>
                <button type="button" onClick={() => setSourceAmount('50000')} className="hover:text-white underline">₹50k</button>
                <span>·</span>
                <button type="button" onClick={() => setSourceAmount('250000')} className="hover:text-white underline">₹2.5L</button>
                <span>·</span>
                <button type="button" onClick={() => setSourceAmount('480000')} className="hover:text-white underline">₹4.8L</button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Destination Corridor
              </label>
              <select
                value={selectedCorridorCode}
                onChange={(e) => setSelectedCorridorCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {corridors.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.country} ({c.currency})
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                <span>FX: 1 INR = {selectedCorridor.rate} {selectedCorridor.currency}</span>
                <span>Est: ~{selectedCorridor.estimatedMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Transparent Conversion Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Transfer Amount</span>
              <span className="font-mono text-white tabular-nums">₹{numericAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span>Transparent Network Fee ({selectedCorridor.feePercent}%)</span>
              </span>
              <span className="font-mono text-slate-300 tabular-nums">- ₹{feeAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-medium">
              <span className="text-slate-200">Recipient Receives Guaranteed</span>
              <span className="text-base font-bold text-sky-400 font-mono tabular-nums">
                {destinationAmount} {selectedCorridor.currency}
              </span>
            </div>
          </div>

          {/* Live AI Pre-Evaluation Warning / Advice */}
          <div className={`p-3 rounded-lg border flex items-center justify-between text-xs ${estimatedRiskLevel.bg} border-slate-800`}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-medium text-slate-200">AI Risk Engine Pre-Check: </span>
                <span className={`font-bold ${estimatedRiskLevel.color}`}>{estimatedRiskLevel.label} RISK</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">
              {numericAmount > 200000 ? 'May trigger compliance verification' : 'Eligible for straight-through settlement'}
            </span>
          </div>

          {/* Recipient Details */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Recipient & Banking Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. Sophia Miller"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Beneficiary Depository Bank
                </label>
                <input
                  type="text"
                  value={recipientBank}
                  onChange={(e) => setRecipientBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="Citibank N.A."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Remittance Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="Family Support & Living Expenses">Family Support & Living Expenses</option>
                  <option value="Higher Education Tuition Fee">Higher Education Tuition Fee</option>
                  <option value="Software Freelance Retainer Settlement">Software Freelance Retainer Settlement</option>
                  <option value="Export Equipment Advance">Export Equipment Advance</option>
                  <option value="Medical Emergency Assistance">Medical Emergency Assistance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Guarantee note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Sensitive bank details encrypted off-chain. Only cryptographic proof is committed to Drunix.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Mints Blockchain Proof...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Initiate Remittance</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
