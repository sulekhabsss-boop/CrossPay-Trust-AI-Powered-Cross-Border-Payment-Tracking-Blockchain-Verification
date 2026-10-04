# CrossPay Trust — System Architecture

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 USER LAYER                                        |
|   Sender (Retail)  ·  Beneficiary (Recipient)  ·  Compliance Officer  ·  Admin   |
+------------------------------------------+----------------------------------------+
                                           |  HTTPS / TLS 1.3
                                           v
+-----------------------------------------------------------------------------------+
|                        FRONTEND PRESENTATION LAYER                                |
|   React SPA · TypeScript · Tailwind CSS · Motion · Plus Jakarta Sans / JetBrains  |
|   - Real-Time Payment Tracker & Visual Timeline                                   |
|   - Explainable AI Risk Score Breakdown & Factors                                 |
|   - Blockchain Ledger Proof Explorer & Cryptographic Verification Card            |
|   - Persona Switcher (Sender / Recipient / Compliance / Admin)                    |
+------------------------------------------+----------------------------------------+
                                           |  REST API & State Streaming
                                           v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY & AUTHENTICATION                               |
|   Express Engine · JWT Verification · Role-Based Access Control (RBAC)            |
+------------------------------------------+----------------------------------------+
                                           |
         +---------------------------------+--------------------------------+
         |                                 |                                |
         v                                 v                                v
+--------------------+           +--------------------+           +--------------------+
|  PAYMENT WORKFLOW  |           |   AI RISK ENGINE   |           |  BLOCKCHAIN PROOF  |
|  & SETTLEMENT RAIL |           |   & ANOMALY MODEL  |           |   LEDGER SERVICE   |
|                    |           |                    |           |                    |
| - State Machine    |           | - Isolation Forest |           | - Drunix Testnet   |
| - Corridor FX Conv |           | - Velocity Engine  |           | - Keccak256 Root   |
| - Citi Sandbox Rail|           | - Explainable Rsns |           | - Smart Contract   |
| - Demo Accelerator |           | - 0-100 Score Band |           | - Merkle Proofs    |
+---------+----------+           +---------+----------+           +---------+----------+
          |                                |                                |
          +--------------------------------+--------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        STORAGE & TAMPER-RESISTANT AUDIT                           |
|   - Off-Chain Invariant State Store (Off-chain PII & Sensitive Bank Details)      |
|   - Cryptographic Audit Log of all State Transitions & Compliance Decisions       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Payment & Risk Lifecycle Flow

```
[SENDER INITIATES]
        |
        v
[KYC & ACCOUNT VALIDATION]
        |
        v
[AI RISK ENGINE EVALUATION]
   ├─► Score < 30 (LOW): Automated Straight-Through Settlement
   ├─► Score 30-59 (MEDIUM): Standard Processing
   ├─► Score 60-79 (HIGH): ──► [ROUTED TO COMPLIANCE OFFICER QUEUE]
   │                                  │
   │                                  ├─► Officer Approves: Proceed to Rail
   │                                  ├─► Officer Requests KYC: Notify Sender
   │                                  └─► Officer Rejects: Terminate & Refund
   │
   └─► Score >= 80 (CRITICAL): ──► [AUTOMATED SUSPICION HOLD]
                                      │
                                      └─► Mandatory Human Investigation
        |
        v
[ON-CHAIN PROOF MINTED ON DRUNIX LEDGER] (Payload Hash + State + Timestamp)
        |
        v
[CITI SANDBOX CORRIDOR DISPATCH]
        |
        v
[DESTINATION DEPOSITORY BANK CLEARING]
        |
        v
[SETTLEMENT COMPLETED] ──► [OFFICIAL RECEIPT GENERATION]
```

---

## 3. Security & Data Privacy Separation

- **On-Chain Data**: Strictly limited to Transaction ID, SHA-256 payload hash, state enum, block number, and timestamp.
- **Off-Chain Data**: Passwords, banking account numbers, KYC identity documents, and personal contact details are stored strictly in private databases with access restricted via RBAC.
