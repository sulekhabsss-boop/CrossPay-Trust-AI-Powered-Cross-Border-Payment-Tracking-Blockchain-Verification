"""
Feature Engineering Pipeline for Cross-Border Remittance Risk Analysis
"""

from typing import Dict, Any, List

CORRIDOR_RISK_MAP = {
    "AE": 0.65, # UAE
    "SG": 0.25, # Singapore
    "US": 0.15, # USA
    "GB": 0.15, # UK
    "EU": 0.15, # Eurozone
    "CA": 0.12, # Canada
    "AU": 0.12, # Australia
}

def extract_features(tx_data: Dict[str, Any]) -> List[float]:
    """
    Extract normalized feature vector for transaction assessment:
    [0]: Amount in INR
    [1]: Transaction count in last 24 hours
    [2]: Recipient novelty (1.0 for new, 0.0 for recognized)
    [3]: Corridor risk score (0.0 to 1.0)
    [4]: KYC status penalty (1.0 unverified, 0.0 verified)
    """
    amount = float(tx_data.get("amount_inr", 0))
    velocity_24h = float(tx_data.get("tx_count_24h", 0))
    is_new_recipient = 1.0 if tx_data.get("is_new_recipient", False) else 0.0
    corridor = tx_data.get("destination_country", "US").upper()
    corridor_risk = CORRIDOR_RISK_MAP.get(corridor, 0.30)
    kyc_status = tx_data.get("kyc_status", "VERIFIED")
    kyc_penalty = 0.0 if kyc_status == "VERIFIED" else 0.8

    return [amount, velocity_24h, is_new_recipient, corridor_risk, kyc_penalty]
