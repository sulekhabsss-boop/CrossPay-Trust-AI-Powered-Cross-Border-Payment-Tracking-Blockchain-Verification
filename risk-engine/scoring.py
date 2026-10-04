"""
Composite Risk Scoring Strategy for CrossPay Trust
Combines Behaviour, Transaction Volume, Velocity/Frequency, and Corridor compliance.
"""

from typing import Dict, Any, Tuple
from .model import CrossPayRiskModel
from .features import extract_features

def compute_risk_score(tx_data: Dict[str, Any]) -> Tuple[int, str]:
    """
    Computes an integer risk score between 0 and 100, and categorizes into:
    LOW (0-29), MEDIUM (30-59), HIGH (60-79), CRITICAL (80-100).
    """
    features = extract_features(tx_data)
    model = CrossPayRiskModel()
    anomaly_prob = model.predict_anomaly_score(features)
    
    # Scale to 0-100 integer range
    score = int(round(anomaly_prob * 100))
    
    if score >= 80:
        level = "CRITICAL"
    elif score >= 60:
        level = "HIGH"
    elif score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"
        
    return score, level
