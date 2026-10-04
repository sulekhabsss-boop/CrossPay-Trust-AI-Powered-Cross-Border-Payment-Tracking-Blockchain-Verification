export type UserRole = 'sender' | 'recipient' | 'compliance' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  country: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'TIER_2_REQUIRED';
  createdAt: string;
}

export type TransactionStatus =
  | 'INITIATED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'RISK_REVIEW'
  | 'PROCESSING'
  | 'COMPLIANCE_REVIEW'
  | 'SETTLEMENT_PENDING'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'REJECTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  category: 'AMOUNT' | 'VELOCITY' | 'CORRIDOR' | 'RECIPIENT_HISTORY' | 'BEHAVIOR';
  description: string;
  weight: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskAssessment {
  score: number; // 0-100
  level: RiskLevel;
  explanation: string[];
  factors: RiskFactor[];
  recommendation: 'APPROVE_AUTOMATICALLY' | 'STANDARD_PROCESSING' | 'MANUAL_COMPLIANCE_REVIEW' | 'HOLD_FOR_INVESTIGATION';
  evaluatedAt: string;
  modelVersion: string;
}

export interface BlockchainRecord {
  network: string;
  contractAddress: string;
  blockNumber: number;
  transactionHash: string;
  merkleProof: string;
  timestamp: string;
  status: 'VERIFIED' | 'PENDING_CONFIRMATION';
  payloadHash: string;
  integrityVerified: boolean;
  explorerUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  transactionId: string;
  result: string;
  notes?: string;
  ipAddress?: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId?: string;
  recipientName: string;
  recipientEmail: string;
  recipientBank: string;
  recipientAccountLast4: string;
  sourceCountry: string;
  destinationCountry: string;
  sourceCurrency: string;
  destinationCurrency: string;
  sourceAmount: number;
  destinationAmount: number;
  exchangeRate: number;
  fee: number;
  purpose: string;
  status: TransactionStatus;
  statusHistory: Array<{
    status: TransactionStatus;
    timestamp: string;
    note?: string;
  }>;
  riskAssessment: RiskAssessment;
  blockchainRecord: BlockchainRecord;
  auditTrail: AuditLog[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  complianceReviewNote?: string;
  complianceReviewedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  transactionId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ACTION_REQUIRED';
  read: boolean;
  timestamp: string;
}

export interface CorridorRate {
  code: string;
  country: string;
  currency: string;
  flag: string;
  rate: number; // 1 INR to X
  feePercent: number;
  estimatedMinutes: number;
  corridorRiskWeight: number;
}

export interface DashboardMetrics {
  totalTransactions: number;
  totalVolumeINR: number;
  activeTransfers: number;
  completedTransfers: number;
  flaggedTransactions: number;
  pendingComplianceReviews: number;
  averageProcessingTimeMin: number;
  completionRatePercent: number;
  blockchainIntegrityPercent: number;
  corridorBreakdown: Array<{ corridor: string; count: number; volume: number }>;
  riskBreakdown: Array<{ level: RiskLevel; count: number }>;
  monthlyTrend: Array<{ month: string; volumeINR: number; count: number }>;
}
