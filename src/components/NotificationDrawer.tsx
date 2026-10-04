import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Info, ShieldAlert, Check } from 'lucide-react';
import { Notification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onSelectTransactionId?: (txId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onSelectTransactionId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">System Notifications</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {notifications.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const icon = 
                  n.type === 'SUCCESS' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> :
                  n.type === 'WARNING' || n.type === 'ACTION_REQUIRED' ? <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" /> :
                  <Info className="h-4 w-4 text-sky-400 shrink-0" />;

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                      n.read 
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-75' 
                        : 'bg-slate-950 border-slate-700/80 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        {icon}
                        <span>{n.title}</span>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => onMarkRead(n.id)}
                          className="text-[10px] text-sky-400 hover:text-sky-300"
                          title="Mark read"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                      <span>Ref: {n.transactionId}</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
