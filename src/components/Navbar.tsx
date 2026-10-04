import React, { useState } from 'react';
import { User, UserRole, Notification } from '../types';
import { 
  ShieldCheck, 
  Send, 
  UserCheck, 
  SlidersHorizontal, 
  Bell, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
  activeTab: 'overview' | 'send' | 'compliance' | 'ledger' | 'docs';
  onSelectTab: (tab: 'overview' | 'send' | 'compliance' | 'ledger' | 'docs') => void;
  notifications: Notification[];
  onOpenNotifications: () => void;
  onOpenSendModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  activeTab,
  onSelectTab,
  notifications,
  onOpenNotifications,
  onOpenSendModal,
  onLogout
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: any }> = {
    sender: { title: 'Sender', subtitle: 'Aarav Mehta (Retail Remitter)', icon: Send },
    recipient: { title: 'Recipient', subtitle: 'Sophia Miller (Global Beneficiary)', icon: UserCheck },
    compliance: { title: 'Compliance Officer', subtitle: 'Vikram Sengupta (Risk Specialist)', icon: ShieldCheck },
    admin: { title: 'Administrator', subtitle: 'Devraj Khurana (Platform Ops)', icon: SlidersHorizontal }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectTab('overview')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:border-sky-400 transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
              CrossPay Trust
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-400">
            <button
              onClick={() => onSelectTab('overview')}
              className={`hover:text-white transition-colors py-1 ${activeTab === 'overview' ? 'text-white border-b-2 border-sky-500 font-semibold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('compliance')}
              className={`hover:text-white transition-colors py-1 ${activeTab === 'compliance' ? 'text-white border-b-2 border-sky-500 font-semibold' : ''}`}
            >
              Compliance Queue
            </button>
            <button
              onClick={() => onSelectTab('ledger')}
              className={`hover:text-white transition-colors py-1 ${activeTab === 'ledger' ? 'text-white border-b-2 border-sky-500 font-semibold' : ''}`}
            >
              Drunix Ledger
            </button>
            <button
              onClick={() => onSelectTab('docs')}
              className={`hover:text-white transition-colors py-1 ${activeTab === 'docs' ? 'text-white border-b-2 border-sky-500 font-semibold' : ''}`}
            >
              API Docs
            </button>
          </nav>
        </div>

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Send Button */}
          <button
            onClick={onOpenSendModal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Money</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            )}
          </button>

          {/* Persona / Role Switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors focus:outline-none"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                {currentUser.role === 'sender' && <Send className="h-3 w-3" />}
                {currentUser.role === 'recipient' && <UserCheck className="h-3 w-3" />}
                {currentUser.role === 'compliance' && <ShieldCheck className="h-3 w-3" />}
                {currentUser.role === 'admin' && <SlidersHorizontal className="h-3 w-3" />}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium text-white">{roleLabels[currentUser.role].title}</div>
              </div>
              <span className="text-[10px] text-slate-500 ml-1">Switch ▾</span>
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Switch Persona (Hackathon Demo)
                </div>
                {(['sender', 'recipient', 'compliance', 'admin'] as UserRole[]).map((r) => {
                  const ItemIcon = roleLabels[r].icon;
                  const isSelected = currentUser.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onSelectRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected 
                          ? 'bg-sky-500/10 border border-sky-500/30 text-white' 
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className={`mt-0.5 p-1 rounded-md ${isSelected ? 'text-sky-400' : 'text-slate-400'}`}>
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-1.5">
                          {roleLabels[r].title}
                          {isSelected && <span className="text-[10px] text-sky-400">● Active</span>}
                        </div>
                        <div className="text-[11px] text-slate-400">{roleLabels[r].subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Log out and return to public website"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
