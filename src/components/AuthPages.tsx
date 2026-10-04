import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Globe, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthPagesProps {
  initialMode: 'login' | 'signup' | 'forgot-password';
  onNavigateLanding: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode,
  onNavigateLanding,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength logic
  const passwordStrength = useMemo(() => {
    if (!password) return { label: 'None', score: 0, color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 3) return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
    if (score === 2) return { label: 'Medium', score: 2, color: 'bg-amber-500' };
    return { label: 'Weak', score: 1, color: 'bg-rose-500' };
  }, [password]);

  // Demo accounts helper
  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setErrorMessage(null);
  };

  // Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password,
          country,
          phone,
          role: 'sender'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccessMessage('Account created successfully! Please login with your credentials to continue.');
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Safe demo response (does not leak email registration state)
    setSuccessMessage('If an account exists for this email, password reset instructions will be provided.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top back to landing button */}
      <div className="max-w-5xl mx-auto w-full mb-4">
        <button
          onClick={onNavigateLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to CrossPay Trust Home</span>
        </button>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE: Brand & Visual Area */}
        <div className="lg:col-span-5 relative p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 border-b lg:border-b-0 lg:border-r border-slate-800">
          
          {/* Top Brand Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CrossPay Trust
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-2xl font-extrabold text-white leading-snug">
                Every payment should be visible, explainable, and verifiable.
              </h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Connect directly to real-time status tracking, explainable AI risk evaluations, and Drunix blockchain verification proofs.
              </p>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="my-8 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                DRUNIX TESTNET
              </span>
              <span>PROOF LEDGER</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Consensus:</span>
                <span className="font-mono text-white">Proof of Authority (BFT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Privacy:</span>
                <span className="text-emerald-400 font-mono">Off-Chain PII Isolation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement:</span>
                <span className="font-mono text-sky-300">Citi Sandbox Rail</span>
              </div>
            </div>
          </div>

          {/* Bottom Hackathon Marker */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Citi Track Prototype</span>
            <span className="font-mono">2026 Edition</span>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Form Area */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authMode === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in to continue to your CrossPay Trust dashboard.
                </p>
              </div>

              {/* Demo Account Quick-Fill Chips for Hackathon Judges */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-sky-400" />
                    <span>Evaluation Demo Accounts (1-Click Fill):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">pass: demo123</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('sender@crosspay.demo')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
                  >
                    Sender (Aarav)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('compliance@crosspay.demo')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                  >
                    Compliance (Vikram)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin@crosspay.demo')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
                  >
                    Admin (Devraj)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('recipient@crosspay.demo')}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors"
                  >
                    Recipient (Sophia)
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@crosspay.demo"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-sky-600 focus:ring-0"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot-password'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* 2. SIGN UP FORM */}
          {authMode === 'signup' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create your CrossPay Trust account</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Start tracking your cross-border payments with greater transparency and confidence.
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Password (min 8 chars)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Password strength:</span>
                      <span className="font-semibold text-slate-300">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-700'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-700'}`} />
                      <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-700'}`} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Origin Country (Optional)
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                    >
                      <option value="India">India (INR)</option>
                      <option value="United States">United States (USD)</option>
                      <option value="United Kingdom">United Kingdom (GBP)</option>
                      <option value="United Arab Emirates">United Arab Emirates (AED)</option>
                      <option value="Singapore">Singapore (SGD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {authMode === 'forgot-password' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Reset your password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your email address to receive password reset instructions.
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20 transition-all"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
