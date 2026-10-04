import {
  User,
  Transaction,
  AuditLog,
  Notification,
  CorridorRate,
  DashboardMetrics,
  TransactionStatus,
  RiskLevel
} from '../types';
import { blockchainService } from './blockchainService';
import { evaluateTransactionRisk } from './riskEngine';

export interface SystemSettings {
  autoApproveRiskThreshold: number; // default 30
  manualReviewRiskThreshold: number; // default 60
  criticalHoldRiskThreshold: number; // default 80
  demoModeSpeedSeconds: number; // default 3
  maintenanceMode: boolean;
  complianceAutoNotification: boolean;
}

export const CORRIDOR_RATES: CorridorRate[] = [
  {
    code: 'US',
    country: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    rate: 0.0118, // 1 INR = 0.0118 USD
    feePercent: 0.75,
    estimatedMinutes: 8,
    corridorRiskWeight: 6
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    rate: 0.0093, // 1 INR = 0.0093 GBP
    feePercent: 0.70,
    estimatedMinutes: 10,
    corridorRiskWeight: 6
  },
  {
    code: 'EU',
    country: 'European Union (Eurozone)',
    currency: 'EUR',
    flag: '🇪🇺',
    rate: 0.0109, // 1 INR = 0.0109 EUR
    feePercent: 0.80,
    estimatedMinutes: 12,
    corridorRiskWeight: 6
  },
  {
    code: 'AE',
    country: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪',
    rate: 0.0433, // 1 INR = 0.0433 AED
    feePercent: 0.85,
    estimatedMinutes: 15,
    corridorRiskWeight: 18
  },
  {
    code: 'SG',
    country: 'Singapore',
    currency: 'SGD',
    flag: '🇸🇬',
    rate: 0.0158, // 1 INR = 0.0158 SGD
    feePercent: 0.75,
    estimatedMinutes: 6,
    corridorRiskWeight: 8
  },
  {
    code: 'CA',
    country: 'Canada',
    currency: 'CAD',
    flag: '🇨🇦',
    rate: 0.0163, // 1 INR = 0.0163 CAD
    feePercent: 0.80,
    estimatedMinutes: 14,
    corridorRiskWeight: 5
  },
  {
    code: 'AU',
    country: 'Australia',
    currency: 'AUD',
    flag: '🇦🇺',
    rate: 0.0182, // 1 INR = 0.0182 AUD
    feePercent: 0.85,
    estimatedMinutes: 15,
    corridorRiskWeight: 5
  }
];

class DatabaseStore {
  public users: Map<string, User> = new Map();
  public userPasswords: Map<string, string> = new Map(); // demo hashed / plaintext stored safely in memory
  public transactions: Map<string, Transaction> = new Map();
  public auditLogs: AuditLog[] = [];
  public notifications: Notification[] = [];
  public settings: SystemSettings = {
    autoApproveRiskThreshold: 30,
    manualReviewRiskThreshold: 60,
    criticalHoldRiskThreshold: 80,
    demoModeSpeedSeconds: 3,
    maintenanceMode: false,
    complianceAutoNotification: true
  };

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Primary Demo Users
    const demoUsers: Array<User & { password: string }> = [
      {
        id: 'usr_sender_01',
        name: 'Aarav Mehta',
        email: 'sender@crosspay.demo',
        role: 'sender',
        country: 'India',
        kycStatus: 'VERIFIED',
        createdAt: '2026-08-10T08:30:00Z',
        password: 'demo123'
      },
      {
        id: 'usr_recipient_01',
        name: 'Sophia Miller',
        email: 'recipient@crosspay.demo',
        role: 'recipient',
        country: 'United States',
        kycStatus: 'VERIFIED',
        createdAt: '2026-08-12T10:15:00Z',
        password: 'demo123'
      },
      {
        id: 'usr_comp_01',
        name: 'Vikram Sengupta',
        email: 'compliance@crosspay.demo',
        role: 'compliance',
        country: 'India',
        kycStatus: 'VERIFIED',
        createdAt: '2026-07-01T09:00:00Z',
        password: 'demo123'
      },
      {
        id: 'usr_admin_01',
        name: 'Devraj Khurana',
        email: 'admin@crosspay.demo',
        role: 'admin',
        country: 'India',
        kycStatus: 'VERIFIED',
        createdAt: '2026-06-01T08:00:00Z',
        password: 'demo123'
      }
    ];

    // Additional 18 Synthetic Users to exceed 20+
    const additionalNames = [
      { name: 'Priya Sharma', country: 'India', role: 'sender' },
      { name: 'Rohan Deshmukh', country: 'India', role: 'sender' },
      { name: 'Ananya Iyer', country: 'India', role: 'sender' },
      { name: 'David Chen', country: 'Singapore', role: 'recipient' },
      { name: 'Emma Watson', country: 'United Kingdom', role: 'recipient' },
      { name: 'Lucas Dubois', country: 'European Union (Eurozone)', role: 'recipient' },
      { name: 'Fatima Al-Mansoor', country: 'United Arab Emirates', role: 'recipient' },
      { name: 'Marcus Taylor', country: 'Canada', role: 'recipient' },
      { name: 'Liam O’Connor', country: 'Australia', role: 'recipient' },
      { name: 'Kavita Nair', country: 'India', role: 'compliance' },
      { name: 'Arjun Verma', country: 'India', role: 'sender' },
      { name: 'Elena Rostova', country: 'European Union (Eurozone)', role: 'recipient' },
      { name: 'Siddharth Rao', country: 'India', role: 'sender' },
      { name: 'Rachel Green', country: 'United States', role: 'recipient' },
      { name: 'Omar Farooq', country: 'United Arab Emirates', role: 'recipient' },
      { name: 'Aditi Joshi', country: 'India', role: 'sender' },
      { name: 'Sunita Patel', country: 'India', role: 'admin' },
      { name: 'Kunal Kapoor', country: 'India', role: 'sender' },
    ];

    demoUsers.forEach(u => {
      this.users.set(u.id, {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        country: u.country,
        kycStatus: u.kycStatus,
        createdAt: u.createdAt
      });
      this.userPasswords.set(u.email, u.password);
    });

    additionalNames.forEach((item, idx) => {
      const id = `usr_synth_${idx + 10}`;
      const email = `${item.name.toLowerCase().replace(/[^a-z]/g, '')}@crosspay.synth`;
      this.users.set(id, {
        id,
        name: item.name,
        email,
        role: item.role as any,
        country: item.country,
        kycStatus: idx % 7 === 0 ? 'PENDING' : 'VERIFIED',
        createdAt: `2026-08-${(idx % 25) + 1}T12:00:00Z`
      });
      this.userPasswords.set(email, 'demo123');
    });

    // 2. Seed 50+ Realistically Synthesized Transactions
    const corridors = ['US', 'GB', 'EU', 'AE', 'SG', 'CA', 'AU'];
    const statuses: TransactionStatus[] = [
      'COMPLETED',
      'COMPLETED',
      'COMPLETED',
      'PROCESSING',
      'SETTLEMENT_PENDING',
      'COMPLIANCE_REVIEW',
      'RISK_REVIEW',
      'ON_HOLD',
      'VERIFIED',
      'INITIATED'
    ];

    const samplePurposes = [
      'Family Support & Living Expenses',
      'Higher Education Tuition Fee',
      'Software Freelance Retainer Settlement',
      'Medical Emergency Assistance',
      'Export Vendor Equipment Advance',
      'Property Lease Security Deposit',
      'Conference & Research Sponsorship'
    ];

    const recipientBanks = [
      'Citibank N.A. (US)',
      'Barclays UK PLC',
      'Deutsche Bank AG Frankfurt',
      'Emirates NBD Dubai',
      'DBS Bank Singapore',
      'Royal Bank of Canada',
      'Westpac Banking Corp Sydney'
    ];

    for (let i = 1; i <= 52; i++) {
      const txNum = String(i).padStart(4, '0');
      const hexCode = (Math.abs(Math.sin(i) * 16777215) | 0).toString(16).toUpperCase().padStart(6, '0');
      const txId = `CP-2026-${hexCode}`;
      
      const corridorCode = corridors[i % corridors.length];
      const corridorData = CORRIDOR_RATES.find(c => c.code === corridorCode) || CORRIDOR_RATES[0];
      
      // Calculate varied realistic amounts
      let sourceAmount = 15000 + ((i * 7391) % 180000);
      if (i === 12 || i === 27) sourceAmount = 250000; // Scenario: High Risk
      if (i === 44 || i === 49) sourceAmount = 480000; // Scenario: Critical Risk
      if (i === 1) sourceAmount = 25000; // Demo scenario 1: Normal Low Risk

      const fee = Math.round(sourceAmount * (corridorData.feePercent / 100));
      const netINR = sourceAmount - fee;
      const destinationAmount = Number((netINR * corridorData.rate).toFixed(2));

      // Decide status
      let status: TransactionStatus;
      if (i === 1) {
        status = 'COMPLETED';
      } else if (i === 12) {
        status = 'COMPLIANCE_REVIEW';
      } else if (i === 44) {
        status = 'ON_HOLD';
      } else {
        status = statuses[i % statuses.length];
      }

      // Evaluate Risk
      const isBurst = (i === 44 || i === 49);
      const isNewRecipient = (i % 3 === 0 || i === 12);
      const riskAssessment = evaluateTransactionRisk({
        amountINR: sourceAmount,
        corridor: corridorCode,
        senderId: 'usr_sender_01',
        recipientEmail: `recipient.${i}@globalbank.net`,
        purpose: samplePurposes[i % samplePurposes.length],
        previousTransactionsCount: (i % 4) + 1,
        recentTransactionsLast24h: isBurst ? 4 : (i % 2),
        isNewRecipient: isNewRecipient,
        userKycStatus: 'VERIFIED',
        accountAgeDays: 45,
        isRapidBurstScenario: isBurst
      });

      // Blockchain record
      const blockchainRecord = blockchainService.createTransactionRecord(
        txId,
        sourceAmount,
        destinationAmount,
        corridorCode,
        status
      );

      const timestamp = new Date(Date.now() - (52 - i) * 3600000 * 3.5).toISOString();

      const auditTrail: AuditLog[] = [
        {
          id: `aud_${i}_1`,
          timestamp: new Date(new Date(timestamp).getTime() - 25000).toISOString(),
          actor: 'Aarav Mehta',
          actorRole: 'sender',
          action: 'PAYMENT_INITIATED',
          transactionId: txId,
          result: `Remittance of ₹${sourceAmount.toLocaleString('en-IN')} created`,
          ipAddress: '157.48.21.94'
        },
        {
          id: `aud_${i}_2`,
          timestamp: new Date(new Date(timestamp).getTime() - 22000).toISOString(),
          actor: 'AI Risk Engine',
          actorRole: 'compliance',
          action: 'RISK_ASSESSMENT_COMPLETED',
          transactionId: txId,
          result: `Score: ${riskAssessment.score}/100 (${riskAssessment.level}) - ${riskAssessment.recommendation}`
        },
        {
          id: `aud_${i}_3`,
          timestamp: new Date(new Date(timestamp).getTime() - 19000).toISOString(),
          actor: 'Drunix Ledger Gateway',
          actorRole: 'admin',
          action: 'BLOCKCHAIN_PROOF_COMMITTED',
          transactionId: txId,
          result: `Block #${blockchainRecord.blockNumber} hash: ${blockchainRecord.transactionHash.slice(0, 18)}...`
        }
      ];

      if (status === 'COMPLIANCE_REVIEW' || status === 'ON_HOLD') {
        auditTrail.push({
          id: `aud_${i}_4`,
          timestamp: new Date(new Date(timestamp).getTime() - 10000).toISOString(),
          actor: 'Compliance Gateway',
          actorRole: 'compliance',
          action: 'ROUTED_TO_OFFICER_QUEUE',
          transactionId: txId,
          result: 'Flagged for high-risk verification by Compliance Officer Vikram Sengupta',
          notes: 'Awaiting source-of-funds verification statement'
        });
      }

      if (status === 'COMPLETED') {
        auditTrail.push({
          id: `aud_${i}_5`,
          timestamp: timestamp,
          actor: 'Citi Settlement Rail (Sandbox)',
          actorRole: 'admin',
          action: 'SETTLEMENT_FINALIZED',
          transactionId: txId,
          result: `Funds credited to destination account ending in ${String(1000 + i).slice(-4)}`
        });
      }

      const txRecord: Transaction = {
        id: txId,
        senderId: 'usr_sender_01',
        senderName: 'Aarav Mehta',
        senderEmail: 'sender@crosspay.demo',
        recipientName: i === 1 ? 'Sophia Miller' : `International Partner ${i}`,
        recipientEmail: i === 1 ? 'recipient@crosspay.demo' : `recipient.${i}@globalbank.net`,
        recipientBank: recipientBanks[i % recipientBanks.length],
        recipientAccountLast4: String(1000 + (i * 37) % 9000),
        sourceCountry: 'India',
        destinationCountry: corridorData.country,
        sourceCurrency: 'INR',
        destinationCurrency: corridorData.currency,
        sourceAmount,
        destinationAmount,
        exchangeRate: corridorData.rate,
        fee,
        purpose: samplePurposes[i % samplePurposes.length],
        status,
        statusHistory: [
          { status: 'INITIATED', timestamp: new Date(new Date(timestamp).getTime() - 25000).toISOString() },
          { status: 'VERIFICATION_PENDING', timestamp: new Date(new Date(timestamp).getTime() - 22000).toISOString() },
          { status: 'VERIFIED', timestamp: new Date(new Date(timestamp).getTime() - 20000).toISOString() },
          { status: 'RISK_REVIEW', timestamp: new Date(new Date(timestamp).getTime() - 18000).toISOString() },
          { status, timestamp }
        ],
        riskAssessment,
        blockchainRecord,
        auditTrail,
        createdAt: timestamp,
        updatedAt: timestamp,
        completedAt: status === 'COMPLETED' ? timestamp : undefined,
        complianceReviewNote: status === 'ON_HOLD' ? 'Multiple rapid transfers in same hour. Requires declaration form.' : undefined,
        complianceReviewedBy: status === 'ON_HOLD' ? 'Vikram Sengupta (Compliance Officer)' : undefined
      };

      this.transactions.set(txId, txRecord);
      this.auditLogs.push(...auditTrail);
    }

    // 3. Seed Starter Notifications
    this.notifications.push(
      {
        id: 'notif_01',
        userId: 'usr_sender_01',
        transactionId: 'CP-2026-8F31A9',
        title: 'Remittance Dispatched',
        message: 'Your transfer to Sophia Miller has completed verification and entered Citi sandbox settlement queue.',
        type: 'SUCCESS',
        read: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'notif_02',
        userId: 'usr_comp_01',
        transactionId: 'CP-2026-HIGH01',
        title: 'High Risk Alert: Review Required',
        message: 'Transfer CP-2026-B812CA (₹2,50,000 to UAE) flagged by AI Risk Engine. Please inspect documentation.',
        type: 'WARNING',
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif_03',
        userId: 'usr_recipient_01',
        transactionId: 'CP-2026-000101',
        title: 'Incoming Remittance Verified',
        message: 'Aarav Mehta initiated an international transfer of $295.00 USD to your Citibank account.',
        type: 'INFO',
        read: true,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    );
  }

  public getDashboardMetrics(): DashboardMetrics {
    const all = Array.from(this.transactions.values());
    const totalTransactions = all.length;
    const totalVolumeINR = all.reduce((sum, tx) => sum + tx.sourceAmount, 0);
    const activeTransfers = all.filter(t => !['COMPLETED', 'REJECTED', 'ON_HOLD'].includes(t.status)).length;
    const completedTransfers = all.filter(t => t.status === 'COMPLETED').length;
    const flaggedTransactions = all.filter(t => t.riskAssessment.level === 'HIGH' || t.riskAssessment.level === 'CRITICAL').length;
    const pendingComplianceReviews = all.filter(t => t.status === 'COMPLIANCE_REVIEW' || t.status === 'ON_HOLD').length;

    const corridorMap: Record<string, { count: number; volume: number }> = {};
    const riskMap: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };

    all.forEach(t => {
      const c = t.destinationCountry.split(' ')[0];
      if (!corridorMap[c]) corridorMap[c] = { count: 0, volume: 0 };
      corridorMap[c].count += 1;
      corridorMap[c].volume += t.sourceAmount;

      riskMap[t.riskAssessment.level] = (riskMap[t.riskAssessment.level] || 0) + 1;
    });

    return {
      totalTransactions,
      totalVolumeINR,
      activeTransfers,
      completedTransfers,
      flaggedTransactions,
      pendingComplianceReviews,
      averageProcessingTimeMin: 4.8,
      completionRatePercent: Math.round((completedTransfers / Math.max(1, totalTransactions)) * 100),
      blockchainIntegrityPercent: 100,
      corridorBreakdown: Object.entries(corridorMap).map(([corridor, data]) => ({
        corridor,
        count: data.count,
        volume: data.volume
      })),
      riskBreakdown: (Object.entries(riskMap) as [RiskLevel, number][]).map(([level, count]) => ({
        level,
        count
      })),
      monthlyTrend: [
        { month: 'May 2026', volumeINR: 1240000, count: 28 },
        { month: 'Jun 2026', volumeINR: 1850000, count: 36 },
        { month: 'Jul 2026', volumeINR: 2420000, count: 44 },
        { month: 'Aug 2026', volumeINR: 3100000, count: 52 },
        { month: 'Sep 2026', volumeINR: 3890000, count: 64 },
        { month: 'Oct 2026', volumeINR: 4650000, count: 71 }
      ]
    };
  }
}

export const db = new DatabaseStore();
