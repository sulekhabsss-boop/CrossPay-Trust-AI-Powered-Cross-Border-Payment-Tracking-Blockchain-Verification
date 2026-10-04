import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  Lock, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Globe2, 
  Clock, 
  FileCheck2, 
  ShieldAlert, 
  Menu, 
  X,
  Server,
  KeyRound,
  FileSpreadsheet,
  Check,
  ChevronRight,
  TrendingUp,
  Building
} from 'lucide-react';

interface PublicLandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignUp: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onNavigateLogin,
  onNavigateSignUp
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* 1. PUBLIC NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CrossPay Trust
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('problem')} 
              className="hover:text-white transition-colors"
            >
              The Problem
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-white transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('security')} 
              className="hover:text-white transition-colors"
            >
              Security
            </button>
            <button 
              onClick={() => scrollToSection('network')} 
              className="hover:text-white transition-colors"
            >
              Global Network
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={onNavigateSignUp}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('problem')} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              The Problem
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('security')} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              Security
            </button>
            <button 
              onClick={() => scrollToSection('network')} 
              className="block w-full text-left py-2 text-sm text-slate-300 hover:text-white"
            >
              Global Network
            </button>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={onNavigateLogin}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-slate-800 text-white"
              >
                Login
              </button>
              <button
                onClick={onNavigateSignUp}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-sky-600 text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Hackathon Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-medium mb-6">
            <span>Drunix Hackathon in collaboration with Citi</span>
            <span aria-hidden="true">·</span>
            <span>Build the Future of Payments in India</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Subheading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Cross-Border Payments, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  Without the Black Box.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Track every payment, understand every risk, and verify every transaction with AI-powered intelligence and blockchain-backed trust.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onNavigateSignUp}
                  className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-xl shadow-sky-600/25 transition-all flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onNavigateLogin}
                  className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
                >
                  Login to Portal
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Real-time lifecycle tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-sky-400" />
                  <span>Explainable AI risk scoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <span>Drunix blockchain verification</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Digital Global Payment Network Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 font-mono text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DRUNIX SETTLEMENT RAIL · CITI SANDBOX</span>
                  </div>
                  <span className="text-[11px] font-mono text-sky-400">LIVE FEED</span>
                </div>

                {/* Network Nodes Simulation */}
                <div className="py-6 space-y-4">
                  {/* Origin Node */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 font-bold text-xs">
                        🇮🇳
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">India (Origin Gateway)</div>
                        <div className="text-[11px] text-slate-400">Sender: Aarav Mehta · SBI Mumbai</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white font-bold text-xs">₹50,000 INR</div>
                      <div className="text-[10px] text-emerald-400">KYC Tier 1 Verified</div>
                    </div>
                  </div>

                  {/* CrossPay Trust Processing Middle Node */}
                  <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-sky-400">
                        <Cpu className="h-4 w-4" />
                        <span>CrossPay Trust Intelligence Layer</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        AI SCORE: 18/100 · LOW
                      </span>
                    </div>

                    {/* Progress steps mini */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center pt-1">
                      <div className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">✓ Ingest</div>
                      <div className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">✓ AI Risk</div>
                      <div className="p-1 rounded bg-slate-900 border border-slate-800 text-sky-400">● Proof #104930</div>
                      <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400">○ Clearing</div>
                    </div>
                  </div>

                  {/* Destination Node */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs">
                        🇺🇸
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">United States (Beneficiary)</div>
                        <div className="text-[11px] text-slate-400">Recipient: Sophia Miller · Citibank NY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-400 font-bold text-xs">$586.25 USD</div>
                      <div className="text-[10px] text-slate-500">1 INR = 0.0118 USD</div>
                    </div>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>TxHash: 0x8f31...a92c</span>
                  <span className="text-emerald-400">✓ Blockchain Proof Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION 1 — THE PROBLEM */}
      <section id="problem" className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              The Current Payment Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cross-border payments shouldn't feel like a black box.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Over $100 billion flows into and out of India annually, yet senders and businesses still face silence, hidden delays, and sudden compliance holds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pain Point 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Limited Visibility</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Users often don't know where their payment currently is. Once funds leave the sender bank, they enter a chain of intermediary correspondent banks with zero status feedback.
              </p>
            </div>

            {/* Pain Point 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Unclear Risk</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Unusual transactions may require additional verification without clear explanations. Automated AML black boxes flag transfers without telling users why or what documentation is required.
              </p>
            </div>

            {/* Pain Point 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Fragmented Tracking</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Multiple payment stages can make the journey difficult to understand. Senders, beneficiaries, and compliance officers have no shared verifiable record of truth.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION 2 — HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              The 5-Stage Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How CrossPay Trust Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A verifiable workflow combining machine intelligence, human compliance controls, and immutable ledger proofs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-2xl font-black font-mono text-sky-400">01</div>
              <h4 className="font-bold text-white text-sm">Start Payment</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sender enters remittance amount in INR, selects destination corridor, and reviews real-time FX rates and transparent fee breakdown.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-2xl font-black font-mono text-sky-400">02</div>
              <h4 className="font-bold text-white text-sm">AI Risk Analysis</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hybrid anomaly engine scores velocity, amount thresholds, corridor AML scrutiny, and relationship history from 0 to 100 with explainable reasons.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-2xl font-black font-mono text-sky-400">03</div>
              <h4 className="font-bold text-white text-sm">Verification</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Identity credentials and destination routing validated. High-risk transfers route to human Compliance Officers rather than arbitrary automated rejection.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-2xl font-black font-mono text-sky-400">04</div>
              <h4 className="font-bold text-white text-sm">Blockchain Proof</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Drunix-compatible ledger records the cryptographic SHA-256 payload hash and block confirmation without exposing sensitive PII.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-3">
              <div className="text-2xl font-black font-mono text-sky-400">05</div>
              <h4 className="font-bold text-white text-sm">Track to Completion</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Funds clear destination bank with second-by-second timeline updates. Beneficiary receives funds and an official cryptographic receipt is issued.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION 3 — FEATURES */}
      <section id="features" className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              Fintech Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise-Grade Cross-Border Intelligence
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Built specifically to satisfy stringent institutional banking standards while delivering clean retail visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">AI Risk Intelligence</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Understand unusual transaction behaviour with explainable 0–100 risk scoring and detailed factor weight breakdowns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Blockchain Verification</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Maintain tamper-resistant transaction records and verification proofs on a Drunix-compatible enterprise ledger.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Real-Time Tracking</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Follow the payment journey from initiation to bank clearing through an interactive visual stage timeline.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Secure Authentication</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Protect accounts with JWT authentication, role-based authorization, and protected dashboard routing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Compliance Review</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Give compliance teams the context needed to review flagged transactions, add notes, and approve or hold transfers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Transparent Receipts</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Provide users with clear transaction records, exchange rate verification, and downloadable cryptographic proof receipts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SECTION 4 — SECURITY */}
      <section id="security" className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Institutional Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built with trust at every layer.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Bank-grade cryptographic architecture designed with complete privacy-by-design guarantees.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <KeyRound className="h-5 w-5 text-sky-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">Secure Authentication</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">JWT verification & session security</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">Role-Based Access</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">RBAC for Senders, Officers & Admins</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <Lock className="h-5 w-5 text-indigo-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">TLS 1.3 Encryption</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">All in-flight payloads fully encrypted</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <Cpu className="h-5 w-5 text-purple-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">AI Risk Scoring</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">Isolation Forest anomaly detection</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <FileSpreadsheet className="h-5 w-5 text-amber-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">Audit Trails</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">Irrevocable action & decision logs</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <Layers className="h-5 w-5 text-teal-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">Blockchain Verification</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">Drunix testnet BFT state proofs</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 col-span-2 sm:col-span-1 lg:col-span-2">
              <Server className="h-5 w-5 text-rose-400" />
              <div className="font-semibold text-white text-xs sm:text-sm">Sensitive Data Kept Off-Chain</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Bank accounts, personal names & KYC documents are never committed on-chain. Only cryptographic roots reside on ledger.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SECTION 5 — GLOBAL PAYMENT NETWORK VISUAL */}
      <section id="network" className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              Interbank Connectivity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Global Payment Network Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Bridging domestic Indian payment infrastructure with international banking rails through CrossPay Trust intelligence.
            </p>
          </div>

          {/* Connected Network Diagram */}
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Origin */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Source</div>
                <div className="text-xl font-bold text-white">INDIA 🇮🇳</div>
                <div className="text-xs text-slate-400">Retail Remitters, Exporters & Students</div>
                <div className="inline-block mt-2 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                  INR Domestic Rail
                </div>
              </div>

              {/* CrossPay Trust Center */}
              <div className="p-6 rounded-xl bg-gradient-to-b from-sky-950/60 to-slate-950 border border-sky-500/40 space-y-3 relative shadow-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  TRUST & INTELLIGENCE LAYER
                </div>
                <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-sky-400" />
                  <span>CROSSPAY TRUST</span>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-center gap-1.5 text-sky-300">
                    <span>● AI Anomaly Risk Engine</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-300">
                    <span>● Drunix Blockchain Proof Minting</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-amber-300">
                    <span>● Compliance Officer Review Queue</span>
                  </div>
                </div>
              </div>

              {/* Destinations */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Destinations</div>
                <div className="text-xl font-bold text-white">GLOBAL HUBS 🌍</div>
                <div className="text-xs text-slate-400">USA · UK · UAE · SINGAPORE · EU</div>
                <div className="inline-block mt-2 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                  USD · GBP · AED · SGD · EUR
                </div>
              </div>

            </div>

            <div className="text-xs text-slate-400 font-mono">
              Citi Prototype Sandbox Clearing Rail · Straight-Through Settlement Target: &lt; 5 minutes
            </div>
          </div>

        </div>
      </section>

      {/* 8. SECTION 6 — TRUST STATEMENT */}
      <section className="py-16 border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI provides intelligence. <br />
              Blockchain provides trust. <br />
              Payment infrastructure provides execution.
            </h3>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            CrossPay Trust is designed as a transparency and intelligence layer around regulated payment infrastructure. It does not replace banks or payment networks.
          </p>

          <div className="text-xs text-slate-400 font-mono">
            Human compliance officers and regulatory policies remain in control of all high-risk decisions.
          </div>
        </div>
      </section>

      {/* 9. SECTION 7 — FINAL CTA */}
      <section className="py-20 border-b border-slate-800 bg-gradient-to-t from-slate-900 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to make payments more transparent?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Create your CrossPay Trust account and explore the payment journey.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateSignUp}
              className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-xl shadow-sky-600/25 transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onNavigateLogin}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* 10. SECTION 8 — FOOTER */}
      <footer className="mt-auto py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              <span className="font-bold text-white text-sm">CrossPay Trust</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Smarter Payments. Trusted Transactions. Complete Visibility.</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">
                Security
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">
                How It Works
              </button>
              <button onClick={onNavigateLogin} className="hover:text-white transition-colors">
                Login
              </button>
              <button onClick={onNavigateSignUp} className="hover:text-white transition-colors">
                Sign Up
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <div>
              <span className="font-semibold text-slate-300">Hackathon Prototype</span> · Drunix Hackathon in collaboration with Citi
            </div>
            <div>
              This is a prototype and does not process real financial transactions unless connected to authorized production payment infrastructure.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
