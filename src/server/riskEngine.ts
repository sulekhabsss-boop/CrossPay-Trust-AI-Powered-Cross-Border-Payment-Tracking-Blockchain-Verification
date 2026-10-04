import { RiskAssessment, RiskFactor, RiskLevel } from '../types';

export interface RiskInput {
  amountINR: number;
  corridor: string;
  senderId: string;
  recipientEmail: string;
  purpose: string;
  previousTransactionsCount: number;
  recentTransactionsLast24h: number;
  isNewRecipient: boolean;
  userKycStatus: string;
  accountAgeDays: number;
  isRapidBurstScenario?: boolean;
}

export function evaluateTransactionRisk(input: RiskInput): RiskAssessment {
  const factors: RiskFactor[] = [];
  const explanations: string[] = [];

  let behaviorScore = 0;
  let transactionScore = 0;
  let frequencyScore = 0;
  let corridorScore = 0;

  // 1. Transaction Amount Analysis
  if (input.amountINR > 500000) {
    transactionScore += 35;
    factors.push({
      category: 'AMOUNT',
      description: 'Transfer amount exceeds ₹5,00,000 threshold for standard retail remittance',
      weight: 35,
      severity: 'critical'
    });
    explanations.push('Transaction amount is significantly higher than standard retail remittance limits.');
  } else if (input.amountINR > 200000) {
    transactionScore += 22;
    factors.push({
      category: 'AMOUNT',
      description: 'Transfer amount is in the upper quartile (₹2,00,000 - ₹5,00,000)',
      weight: 22,
      severity: 'high'
    });
    explanations.push('Transfer amount is notably elevated compared to typical remittance benchmarks.');
  } else if (input.amountINR > 75000) {
    transactionScore += 10;
    factors.push({
      category: 'AMOUNT',
      description: 'Moderate remittance amount within acceptable threshold',
      weight: 10,
      severity: 'medium'
    });
  } else {
    transactionScore += 4;
    factors.push({
      category: 'AMOUNT',
      description: 'Transaction amount is within standard low-risk domestic-to-foreign tier',
      weight: 4,
      severity: 'low'
    });
  }

  // 2. Velocity & Frequency Analysis
  if (input.isRapidBurstScenario || input.recentTransactionsLast24h >= 4) {
    frequencyScore += 32;
    factors.push({
      category: 'VELOCITY',
      description: 'Multiple high-frequency international transfers detected within past 24 hours (velocity spike)',
      weight: 32,
      severity: 'critical'
    });
    explanations.push('Rapid sequence of multiple outbound transfers detected within a 24-hour window.');
  } else if (input.recentTransactionsLast24h >= 2) {
    frequencyScore += 14;
    factors.push({
      category: 'VELOCITY',
      description: 'Second transfer initiated within 24 hours',
      weight: 14,
      severity: 'medium'
    });
    explanations.push('Multiple transactions initiated within 24 hours; slightly elevated velocity.');
  } else {
    frequencyScore += 2;
  }

  // 3. Recipient History & Relationship
  if (input.isNewRecipient) {
    behaviorScore += 16;
    factors.push({
      category: 'RECIPIENT_HISTORY',
      description: 'Recipient account has no established settlement history with this sender',
      weight: 16,
      severity: 'medium'
    });
    explanations.push('Recipient account is first-time added with no prior transaction history.');
  } else {
    behaviorScore += 2;
    factors.push({
      category: 'RECIPIENT_HISTORY',
      description: 'Recipient has completed 3+ successful prior cross-border settlements',
      weight: 2,
      severity: 'low'
    });
  }

  // 4. Corridor & Jurisdictional Weight
  const highScrutinyCorridors: Record<string, number> = {
    AE: 18, // UAE - higher trade/remittance volume scrutiny
    SG: 8,  // Singapore - financial hub
    US: 6,  // USA - standard institutional compliance
    GB: 6,  // UK - standard
    EU: 6,  // Europe - standard
    CA: 5,  // Canada - standard
    AU: 5,  // Australia - standard
  };

  const assignedCorridorWeight = highScrutinyCorridors[input.corridor.toUpperCase()] || 12;
  corridorScore += assignedCorridorWeight;
  if (assignedCorridorWeight > 15) {
    factors.push({
      category: 'CORRIDOR',
      description: `Destination corridor (${input.corridor.toUpperCase()}) subject to elevated regulatory reporting standards`,
      weight: assignedCorridorWeight,
      severity: 'high'
    });
    explanations.push(`Destination corridor (${input.corridor.toUpperCase()}) requires compliance cross-check under cross-border reporting norms.`);
  }

  // 5. Account Maturity & KYC Status
  if (input.userKycStatus !== 'VERIFIED') {
    behaviorScore += 20;
    factors.push({
      category: 'BEHAVIOR',
      description: 'Sender KYC verification pending supplementary documentation',
      weight: 20,
      severity: 'high'
    });
    explanations.push('Sender identity verification tier requires supplementary address or income validation.');
  } else if (input.accountAgeDays < 7) {
    behaviorScore += 8;
    factors.push({
      category: 'BEHAVIOR',
      description: 'New account registered within the past 7 days',
      weight: 8,
      severity: 'medium'
    });
  }

  // Calculate composite score (capped at 100)
  const totalScore = Math.min(
    100,
    Math.max(4, Math.round(behaviorScore + transactionScore + frequencyScore + corridorScore))
  );

  let level: RiskLevel = 'LOW';
  let recommendation: RiskAssessment['recommendation'] = 'APPROVE_AUTOMATICALLY';

  if (totalScore >= 80) {
    level = 'CRITICAL';
    recommendation = 'HOLD_FOR_INVESTIGATION';
  } else if (totalScore >= 60) {
    level = 'HIGH';
    recommendation = 'MANUAL_COMPLIANCE_REVIEW';
  } else if (totalScore >= 30) {
    level = 'MEDIUM';
    recommendation = 'STANDARD_PROCESSING';
  } else {
    level = 'LOW';
    recommendation = 'APPROVE_AUTOMATICALLY';
  }

  if (explanations.length === 0) {
    explanations.push('All standard behavioral heuristics, corridor historical compliance, and velocity metrics within nominal baseline limits.');
  }

  return {
    score: totalScore,
    level,
    factors,
    explanation: explanations,
    recommendation,
    evaluatedAt: new Date().toISOString(),
    modelVersion: 'CrossPay-RiskEngine-v2.4-HybridIsolation'
  };
}
