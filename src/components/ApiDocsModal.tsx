import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'POST',
      path: '/api/transactions',
      title: 'Initiate Remittance Order',
      description: 'Creates a cross-border remittance order, invokes AI Risk Engine, commits initial on-chain proof to Drunix ledger, and queues for Citi sandbox settlement.',
      body: `{
  "sourceAmount": 50000,
  "destinationCountryCode": "US",
  "recipientName": "Sophia Miller",
  "recipientEmail": "recipient@crosspay.demo",
  "recipientBank": "Citibank N.A. (New York)",
  "recipientAccountLast4": "4928",
  "purpose": "Family Support & Living Expenses"
}`,
      curl: `curl -X POST https://api.crosspay.internal/api/transactions \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceAmount":50000,"destinationCountryCode":"US","recipientName":"Sophia Miller"}'`
    },
    {
      method: 'GET',
      path: '/api/transactions/:id',
      title: 'Get Full Transaction Details & Audit Proof',
      description: 'Returns real-time status history, granular AI risk scoring feature weights, and cryptographic block confirmation.',
      curl: `curl -X GET https://api.crosspay.internal/api/transactions/CP-2026-8F31A9 \\
  -H "Authorization: Bearer <JWT_TOKEN>"`
    },
    {
      method: 'POST',
      path: '/api/transactions/:id/approve',
      title: 'Compliance Officer Approval',
      description: 'Approves a flagged or high-risk transaction. Resumes settlement pipeline and records an immutable compliance officer signature in the audit trail.',
      body: `{
  "notes": "Verified source of funds invoice and tax statement.",
  "officerName": "Vikram Sengupta"
}`,
      curl: `curl -X POST https://api.crosspay.internal/api/transactions/CP-2026-8F31A9/approve \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"notes":"Verified documentation"}'`
    },
    {
      method: 'GET',
      path: '/api/blockchain/:transactionId',
      title: 'Verify Drunix Blockchain Proof',
      description: 'Cryptographically verifies the off-chain transfer payload against the on-chain recorded root and returns block confirmation details.',
      curl: `curl -X GET https://api.crosspay.internal/api/blockchain/CP-2026-8F31A9`
    },
    {
      method: 'GET',
      path: '/api/dashboard/summary',
      title: 'Pitch-Friendly Platform Metrics',
      description: 'Retrieves aggregated platform remittance volume, corridor distribution, completion rates, and average processing latency.',
      curl: `curl -X GET https://api.crosspay.internal/api/dashboard/summary`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-400" />
              <span>CrossPay Trust REST API Documentation</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              OpenAPI 3.0 compatible gateway · Available endpoint reference
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    ep.method === 'POST' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-semibold text-white">{ep.path}</span>
                </div>
                <span className="text-xs font-semibold text-slate-300">{ep.title}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {ep.description}
              </p>

              {ep.body && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1">Request Payload:</div>
                  <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-sky-300 overflow-x-auto">
                    {ep.body}
                  </pre>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>cURL Example:</span>
                  <button
                    onClick={() => handleCopy(ep.curl, idx)}
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-sans text-[11px]"
                  >
                    {copiedIndex === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {ep.curl}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
