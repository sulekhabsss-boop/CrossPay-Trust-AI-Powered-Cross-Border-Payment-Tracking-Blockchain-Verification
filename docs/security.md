# CrossPay Trust — Security & Compliance Architecture

## 1. Threat Model & Design Safeguards

### A. Privacy by Design: Off-Chain PII Isolation
A critical vulnerability in naive blockchain fintech applications is publishing sensitive user information onto public or consortium ledgers.
CrossPay Trust enforces strict separation:
- **Off-Chain Private Store**: Personal Identifiable Information (Full legal names, emails, physical addresses, bank routing numbers, account numbers, KYC scans) NEVER touches the blockchain.
- **On-Chain Cryptographic Invariant Proofs**: The Drunix ledger records only the SHA-256 / Keccak256 hash of invariant transfer parameters (`txId`, `sourceAmount`, `destAmount`, `corridorCode`, `timestamp`) alongside state transition proofs.

### B. Role-Based Access Control (RBAC)
Four distinct authorization profiles are enforced:
1. **Sender (`ROLE_SENDER`)**: Can only initiate personal transfers, review own transaction history, and receive notifications.
2. **Recipient (`ROLE_RECIPIENT`)**: Read-only tracking of inbound payments matching recipient email/account.
3. **Compliance Officer (`ROLE_COMPLIANCE`)**: Access to flagged transaction queues, granular AI anomaly factor breakdowns, and authorized state modification (`APPROVE`, `HOLD`, `REQUEST_VERIFICATION`, `REJECT`).
4. **Administrator (`ROLE_ADMIN`)**: System-wide metric visibility, ledger consensus telemetry, risk engine threshold tuning, and immutable audit logs.

### C. AI Governance & Anti-Discrimination Standards
- **Protected Attribute Exclusion**: The AI risk model never ingests religion, gender, ethnicity, caste, or protected demographic traits.
- **Transparent Feature Attribution**: Every calculated score must be accompanied by explicit human-readable reasons (e.g., velocity spikes, unfamiliar beneficiary account history, transaction corridor thresholds).
- **Human-in-the-Loop Mandate**: High or Critical risk ratings do not cause unilateral automated rejection. High-risk transactions trigger a human Compliance Officer review gate.

### D. Cryptographic Audit Logging
Every status transition, whether initiated by the workflow scheduler or an authenticated officer, produces an immutable audit record containing:
- Timestamp (UTC ISO-8601)
- Authenticated Actor ID and Role
- Action Identifier
- Target Transaction Reference
- Execution Result and Reviewer Justification Notes

### E. Regulatory & Sandbox Notice
CrossPay Trust operates against a high-fidelity prototype Citi clearing rail and Drunix testnet ledger. No unauthorized claims of live NPCI, RBI, or Citi production network clearance are made without production credentials.
