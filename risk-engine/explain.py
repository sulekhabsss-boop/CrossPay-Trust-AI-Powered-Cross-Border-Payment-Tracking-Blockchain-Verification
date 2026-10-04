"""
Explainable Risk Intelligence Module
Generates human-understandable justifications and action recommendations.
"""

from typing import Dict, Any, List

def generate_explanation(tx_data: Dict[str, Any], score: int, level: str) -> Dict[str, Any]:
    reasons: List[str] = []
    amount = float(tx_data.get("amount_inr", 0))
    velocity = int(tx_data.get("tx_count_24h", 0))
    is_new = bool(tx_data.get("is_new_recipient", False))
    corridor = str(tx_data.get("destination_country", "US")).upper()

    if amount > 200000:
        reasons.append(f"Transfer value (₹{amount:,.0f}) is higher than standard peer-to-peer retail benchmarks.")
    if velocity >= 3:
        reasons.append(f"Unusual velocity burst: {velocity} international transactions requested within 24 hours.")
    if is_new:
        reasons.append("First-time recipient relationship; no prior successful settlement on ledger.")
    if corridor == "AE":
        reasons.append("Remittance corridor requires dual-stage AML declaration cross-check.")

    if not reasons:
        reasons.append("Transaction matches normal behavioral baseline, standard limits, and verified recipient history.")

    recommendation = (
        "HOLD_FOR_INVESTIGATION" if level == "CRITICAL"
        else "MANUAL_COMPLIANCE_REVIEW" if level == "HIGH"
        else "STANDARD_PROCESSING" if level == "MEDIUM"
        else "APPROVE_AUTOMATICALLY"
    )

    return {
        "score": score,
        "level": level,
        "why": reasons,
        "recommendation": recommendation,
        "human_governance_mandate": "AI scores and explains; human compliance officers approve or reject high-risk transactions."
    }
