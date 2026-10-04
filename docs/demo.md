# CrossPay Trust — Hackathon Live Demo Script (2-3 Minutes)

## Pitch Theme
> **“Cross-border payments should not feel like sending money into a black box.”**
> CrossPay Trust makes the international remittance journey **visible, explainable, secure, and verifiable**.

---

## Step 1: The Problem (0:00 - 0:30)
- **Presenter**: "When an Indian family or freelancer sends money abroad today, it feels like dropping money into a black hole. Is it held up by intermediary banks? Is an AML flag triggered? Nobody knows until days later."
- **Action**: Point to the **Comparison Card** on the CrossPay Trust landing page showing the difference between the legacy Black Box vs. CrossPay Trust’s transparent architecture.

---

## Step 2: Scenario 1 — Nominal Remittance (0:30 - 1:15)
- **Presenter**: "Let's demonstrate Scenario 1: a standard family remittance of ₹25,000 to the United States."
- **Action**: Click the green **`Scenario 1: Nominal (₹25k)`** button on the top evaluation bar.
- **What happens**:
  1. The transaction is created with a unique ID (e.g. `CP-2026-XXXX`).
  2. The AI Risk Engine evaluates the transaction: Score **18/100 (LOW RISK)**.
  3. The Drunix ledger mints an on-chain proof at block height (e.g. #104930).
  4. The live visual timeline smoothly steps forward every 2.5s: `Initiated` → `Verified` → `Risk Review` → `Processing` → `Settled` → `Completed`.
  5. Click **Download Receipt** to show the professional bank-grade receipt with QR reference and cryptographic proof hash.

---

## Step 3: Scenario 2 — High-Risk Anomaly & Human-in-the-Loop (1:15 - 2:00)
- **Presenter**: "Now let's see what happens when an anomalous transaction occurs: a high-value transfer of ₹2,50,000 to a new recipient in UAE."
- **Action**: Click the amber **`Scenario 2: High Risk (₹2.5L)`** button.
- **What happens**:
  1. The AI Risk Engine analyzes signals: High value threshold, new recipient novelty, and UAE corridor weight.
  2. The score calculates as **76/100 (HIGH RISK)** with explicit human-readable reasons in the **Why this evaluation?** panel.
  3. **Crucial moment**: The system does NOT blindly reject the user. Instead, per our principle:
     > *AI provides intelligence. Blockchain provides trust. Humans remain in control.*
  4. The transfer pauses at `COMPLIANCE_REVIEW`.
  5. Switch persona to **Compliance Officer** (`Vikram Sengupta`).
  6. In the Compliance Queue, inspect the flagged anomaly, type review notes, and click **Approve**.
  7. The transaction resumes immediately to Citi settlement, logging an indelible audit event.

---

## Step 4: Scenario 3 — Suspicious Velocity & Critical Hold (2:00 - 2:30)
- **Presenter**: "In Scenario 3, a user attempts multiple rapid burst transfers totaling ₹4,80,000."
- **Action**: Click the red **`Scenario 3: Rapid Velocity (₹4.8L)`** button.
- **What happens**:
  1. The AI Risk Engine detects severe velocity burst and scores **88/100 (CRITICAL RISK)**.
  2. The transaction engages an automated **ON_HOLD** state.
  3. The officer requests supplementary KYC before any funds are moved.

---

## Step 5: Drunix Ledger Proof & Conclusion (2:30 - 3:00)
- **Presenter**: "Throughout every transfer, every state change is hashed and anchored to our Drunix-compatible enterprise ledger. Senders and auditors can click **Re-verify Proof** at any time to guarantee that transaction details were never modified in transit."
- **Action**: Show the Drunix Ledger Explorer tab in the Administrator view.
- **Closing**: "CrossPay Trust transforms cross-border payments into an explainable, auditable, and human-governed financial network for India and the world."
