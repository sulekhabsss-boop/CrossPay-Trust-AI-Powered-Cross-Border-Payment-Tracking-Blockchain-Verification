import React, { useState, useEffect, useCallback } from 'react';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AuthPages } from './components/AuthPages';
import { Navbar } from './components/Navbar';
import { DemoScenarioBar } from './components/DemoScenarioBar';
import { HeroLanding } from './components/HeroLanding';
import { SenderDashboard } from './components/SenderDashboard';
import { RecipientDashboard } from './components/RecipientDashboard';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SendMoneyModal } from './components/SendMoneyModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { 
  User, 
  UserRole, 
  Transaction, 
  DashboardMetrics, 
  CorridorRate, 
  Notification, 
  AuditLog 
} from './types';
import { api } from './services/api';

export function App() {
  // Navigation & Authentication routing state
  // REQUIREMENT: The first screen a new visitor sees must be the public landing page!
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'forgot-password' | 'app'>('landing');
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  // Demo Users Map
  const demoUsers: Record<UserRole, User> = {
    sender: {
      id: 'usr_sender_01',
      name: 'Aarav Mehta',
      email: 'sender@crosspay.demo',
      role: 'sender',
      country: 'India',
      kycStatus: 'VERIFIED',
      createdAt: '2026-08-10T08:30:00Z'
    },
    recipient: {
      id: 'usr_recipient_01',
      name: 'Sophia Miller',
      email: 'recipient@crosspay.demo',
      role: 'recipient',
      country: 'United States',
      kycStatus: 'VERIFIED',
      createdAt: '2026-08-12T10:15:00Z'
    },
    compliance: {
      id: 'usr_comp_01',
      name: 'Vikram Sengupta',
      email: 'compliance@crosspay.demo',
      role: 'compliance',
      country: 'India',
      kycStatus: 'VERIFIED',
      createdAt: '2026-07-01T09:00:00Z'
    },
    admin: {
      id: 'usr_admin_01',
      name: 'Devraj Khurana',
      email: 'admin@crosspay.demo',
      role: 'admin',
      country: 'India',
      kycStatus: 'VERIFIED',
      createdAt: '2026-06-01T08:00:00Z'
    }
  };

  const [currentUser, setCurrentUser] = useState<User>(demoUsers.sender);
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'compliance' | 'ledger' | 'docs'>('overview');

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [corridors, setCorridors] = useState<CorridorRate[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [blockchainStats, setBlockchainStats] = useState<any>(null);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  // Modals
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<Transaction | null>(null);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [txRes, corRes, metRes, audRes, notRes, bcRes] = await Promise.all([
        api.getTransactions(),
        api.getCorridors(),
        api.getDashboardMetrics(),
        api.getAuditLogs(),
        api.getNotifications(currentUser.id),
        api.getBlockchainStats()
      ]);

      setTransactions(txRes.transactions);
      setCorridors(corRes);
      setMetrics(metRes);
      setAuditLogs(audRes.auditLogs);
      setNotifications(notRes);
      setBlockchainStats(bcRes);

      // Keep detail modal updated if an active transaction is open
      if (selectedTxForDetail) {
        const latest = txRes.transactions.find(t => t.id === selectedTxForDetail.id);
        if (latest) {
          setSelectedTxForDetail(latest);
        }
      }
    } catch (err) {
      console.error('Data sync error:', err);
    }
  }, [currentUser.id, selectedTxForDetail?.id]);

  useEffect(() => {
    fetchData();
    // Poll every 3.5s to capture live demo simulation stage advancements
    const interval = setInterval(fetchData, 3500);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle Login Success
  const handleLoginSuccess = (user: User) => {
    setAuthenticatedUser(user);
    setCurrentUser(user);
    // Route to correct dashboard based on role
    if (user.role === 'compliance') {
      setActiveTab('compliance');
    } else if (user.role === 'admin') {
      setActiveTab('overview');
    } else {
      setActiveTab('overview');
    }
    setCurrentView('app');
    fetchData();
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthenticatedUser(null);
    api.setToken(null);
    setCurrentView('landing');
  };

  // Role switch handler (available inside authenticated portal for demo evaluations)
  const handleSelectRole = (role: UserRole) => {
    const targetUser = demoUsers[role];
    setCurrentUser(targetUser);
    setAuthenticatedUser(targetUser);
    if (role === 'compliance') setActiveTab('compliance');
    else if (role === 'admin') setActiveTab('overview');
    else setActiveTab('overview');
  };

  // Trigger Predefined Demo Scenario
  const handleTriggerScenario = async (scenarioId: 'scenario_1' | 'scenario_2' | 'scenario_3') => {
    try {
      setLoadingScenario(scenarioId);
      const res = await api.triggerDemoScenario(scenarioId);
      await fetchData();
      setSelectedTxForDetail(res.transaction);
    } catch (err: any) {
      console.error('Failed to trigger demo scenario:', err);
    } finally {
      setLoadingScenario(null);
    }
  };

  // Transaction Created Callback
  const handleTransactionCreated = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    setSelectedTxForDetail(tx);
    fetchData();
  };

  // Advance Stage
  const handleAdvanceStage = async (txId: string) => {
    try {
      const res = await api.advanceTransaction(txId);
      setSelectedTxForDetail(res.transaction);
      fetchData();
    } catch (err) {
      console.error('Failed to advance stage:', err);
    }
  };

  // Compliance Handlers
  const handleApproveTransaction = async (txId: string, notes?: string) => {
    const res = await api.approveTransaction(txId, notes);
    setSelectedTxForDetail(res.transaction);
    fetchData();
  };

  const handleHoldTransaction = async (txId: string, notes?: string) => {
    const res = await api.holdTransaction(txId, notes);
    setSelectedTxForDetail(res.transaction);
    fetchData();
  };

  const handleRequestVerification = async (txId: string, notes?: string) => {
    const res = await api.requestVerification(txId, notes);
    setSelectedTxForDetail(res.transaction);
    fetchData();
  };

  const handleRejectTransaction = async (txId: string, notes?: string) => {
    const res = await api.rejectTransaction(txId, notes);
    setSelectedTxForDetail(res.transaction);
    fetchData();
  };

  // Re-verify blockchain
  const handleReverifyBlockchain = async (txId: string) => {
    return api.verifyBlockchain(txId);
  };

  // Update Settings
  const handleUpdateSettings = async (settingsData: any) => {
    await api.updateSystemSettings(settingsData);
    fetchData();
  };

  // 1. PUBLIC LANDING PAGE (First screen visitor sees!)
  if (currentView === 'landing' || !authenticatedUser) {
    if (currentView === 'login' || currentView === 'signup' || currentView === 'forgot-password') {
      return (
        <AuthPages
          initialMode={currentView}
          onNavigateLanding={() => setCurrentView('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    return (
      <PublicLandingPage
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateSignUp={() => setCurrentView('signup')}
      />
    );
  }

  // 2. PROTECTED AUTHENTICATED DASHBOARD APPLICATION
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar with Three-Zone Contract + Logout button */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'send') setIsSendModalOpen(true);
          else if (tab === 'docs') setIsApiDocsOpen(true);
          else setActiveTab(tab);
        }}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSendModal={() => setIsSendModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Demo Evaluation Scenarios Bar */}
      <DemoScenarioBar
        onTriggerScenario={handleTriggerScenario}
        loadingScenario={loadingScenario}
        activeTransactionId={selectedTxForDetail?.id}
      />

      {/* Hero context banner inside dashboard overview */}
      {activeTab === 'overview' && (
        <HeroLanding
          onOpenSendModal={() => setIsSendModalOpen(true)}
          onSelectTab={(t) => setActiveTab(t as any)}
        />
      )}

      {/* Main Role-Specific View Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'sender' && activeTab === 'overview' && (
          <SenderDashboard
            transactions={transactions}
            metrics={metrics}
            onOpenSendModal={() => setIsSendModalOpen(true)}
            onSelectTransaction={(tx) => setSelectedTxForDetail(tx)}
            corridors={corridors}
          />
        )}

        {currentUser.role === 'recipient' && activeTab === 'overview' && (
          <RecipientDashboard
            transactions={transactions}
            onSelectTransaction={(tx) => setSelectedTxForDetail(tx)}
            onOpenReceipt={(tx) => setReceiptTx(tx)}
          />
        )}

        {(currentUser.role === 'compliance' || activeTab === 'compliance') && (
          <ComplianceDashboard
            transactions={transactions}
            onSelectTransaction={(tx) => setSelectedTxForDetail(tx)}
            onApproveTransaction={handleApproveTransaction}
            onHoldTransaction={handleHoldTransaction}
            onRequestVerification={handleRequestVerification}
            onRejectTransaction={handleRejectTransaction}
          />
        )}

        {(currentUser.role === 'admin' || activeTab === 'ledger') && (
          <AdminDashboard
            metrics={metrics}
            auditLogs={auditLogs}
            transactions={transactions}
            blockchainStats={blockchainStats}
            onUpdateSettings={handleUpdateSettings}
            onSelectTransaction={(tx) => setSelectedTxForDetail(tx)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">CrossPay Trust</span>
            <span aria-hidden="true">·</span>
            <span>Drunix Hackathon in collaboration with Citi</span>
            <span aria-hidden="true">·</span>
            <span>Prototype Sandbox Environment</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsApiDocsOpen(true)} className="hover:text-white transition-colors">
              API Specification
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('ledger')} className="hover:text-white transition-colors">
              Drunix Ledger Proofs
            </button>
            <span>·</span>
            <button onClick={handleLogout} className="hover:text-white transition-colors text-sky-400">
              Return to Public Site
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <SendMoneyModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        corridors={corridors}
        onTransactionCreated={handleTransactionCreated}
        apiCreateTransaction={api.createTransaction.bind(api)}
      />

      <TransactionDetailModal
        transaction={selectedTxForDetail}
        isOpen={selectedTxForDetail !== null}
        onClose={() => setSelectedTxForDetail(null)}
        onAdvanceStage={handleAdvanceStage}
        onOpenReceipt={(tx) => setReceiptTx(tx)}
        onReverifyBlockchain={handleReverifyBlockchain}
      />

      <ReceiptModal
        transaction={receiptTx}
        isOpen={receiptTx !== null}
        onClose={() => setReceiptTx(null)}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          fetchData();
        }}
      />
    </div>
  );
}

export default App;
