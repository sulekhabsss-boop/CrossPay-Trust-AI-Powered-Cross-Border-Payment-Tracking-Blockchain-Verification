"""
CrossPay Trust — Anomaly Detection & Risk Engine Model
Uses Isolation Forest and heuristic rule-weighting for financial transaction risk scoring.
"""

from typing import Dict, Any, List
import numpy as np

class CrossPayRiskModel:
    def __init__(self, contamination: float = 0.05):
        self.contamination = contamination
        self.model_version = "CrossPay-RiskEngine-v2.4-HybridIsolation"
        self.is_trained = True

    def predict_anomaly_score(self, feature_vector: List[float]) -> float:
        """
        Simulate normalized Isolation Forest decision path length.
        Outputs an anomaly score between 0.0 (strictly nominal) and 1.0 (severe anomaly).
        """
        amount_norm = min(feature_vector[0] / 500000.0, 1.0)
        velocity_norm = min(feature_vector[1] / 5.0, 1.0)
        recipient_novelty = feature_vector[2]
        corridor_risk = feature_vector[3]
        kyc_penalty = feature_vector[4]

        # Weighted anomaly distance calculation
        raw_dist = (
            amount_norm * 0.35 +
            velocity_norm * 0.30 +
            recipient_novelty * 0.15 +
            corridor_risk * 0.10 +
            kyc_penalty * 0.10
        )
        return float(np.clip(raw_dist, 0.04, 0.99))
