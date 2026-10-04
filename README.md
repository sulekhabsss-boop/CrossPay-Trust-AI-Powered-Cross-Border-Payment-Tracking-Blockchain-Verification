# CrossPay Trust

### *Smarter Payments. Trusted Transactions. Complete Visibility.*

Built for the **Drunix Hackathon in collaboration with Citi** under the challenge:  
**Build the Future of Payments in India**

---

## 1. Problem Statement

When individuals and businesses in India send money internationally, they encounter a fundamental opacity:
- **The Black Box**: Once funds leave their local bank, senders have zero visibility into where their payment is, whether intermediary correspondent banks have cleared it, or when the beneficiary will receive it.
- **Unexplained Delays**: Payments are frequently stalled by automated AML/compliance filters without transparent explanations or recourse.
- **Counterparty Anxiety**: Beneficiaries and senders cannot cryptographically verify whether instructions were altered in transit.

## 2. The CrossPay Trust Solution

CrossPay Trust introduces a real-time, explainable intelligence and audit layer between payment initiation and bank settlement rails:
- **AI-Assisted Risk Engine**: Calculates a continuous 0–100 anomaly score with human-readable justifications, preventing arbitrary algorithmic rejections.
- **Blockchain Verification Layer**: Records immutable state transition proofs and Merkle roots on a Drunix-compatible enterprise ledger.
- **End-to-End Visibility**: Senders, recipients, and compliance teams track the payment journey stage-by-stage in real time.
- **Human-in-the-Loop Governance**: AI analyzes and explains; human compliance officers retain final authority over high-risk transactions.

> **Fintech Principle**:  
> *AI provides intelligence. Blockchain provides trust. The payment system provides execution. Humans and policies remain in control of high-risk decisions.*

---

## 3. Key Features

- **Multi-Role Portals**: Dedicated workspaces for Senders, Beneficiaries, Compliance Officers, and Platform Administrators.
- **Interactive Visual Timeline**: Real-time status tracker covering `INITIATED` → `VERIFICATION_PENDING` → `VERIFIED` → `RISK_REVIEW` → `COMPLIANCE_REVIEW` → `PROCESSING` → `SETTLEMENT_PENDING` → `COMPLETED` (plus `ON_HOLD` and `REJECTED`).
- **Explainable AI Risk Breakdown**: Granular feature weights (velocity, amount quartile, corridor scrutiny, KYC maturity, relationship history) with human-readable reasoning.
- **Drunix-Compatible Blockchain Proofs**: Keccak256/SHA-256 payload root hashing, block commitment proofs, and instant tamper-verification checks.
- **Predefined Hackathon Demo Scenarios**: 1-click evaluation scenarios for judges:
  1. *Scenario 1 (Nominal)*: ₹25,000 to USA — Low Risk (18/100), straight-through automated completion.
  2. *Scenario 2 (High Risk)*: ₹2,50,000 to UAE — High Risk (76/100), pauses for human Compliance Officer review.
  3. *Scenario 3 (Velocity Burst)*: ₹4,80,000 to Singapore — Critical Risk (88/100), automated investigative hold.
- **Bank-Grade Remittance Receipts**: Printable/downloadable receipt with cryptographic hash references, applied FX rates, and compliance seals.
- **Regulatory Audit Trail**: Immutable logging of all state transitions and reviewer signatures.

---

## 4. User Roles & Demo Credentials

| Role | Name | Email | Password | Primary Capability |
|---|---|---|---|---|
| **Sender** | Aarav Mehta | `sender@crosspay.demo` | `demo123` | Initiate remittances, track progress, download receipts |
| **Recipient** | Sophia Miller | `recipient@crosspay.demo` | `demo123` | View inbound credits, Citibank account tracking |
| **Compliance Officer** | Vikram Sengupta | `compliance@crosspay.demo` | `demo123` | Inspect flagged anomalies, approve/hold/verify/reject |
| **Administrator** | Devraj Khurana | `admin@crosspay.demo` | `demo123` | Ledger explorer, platform volume, tune risk thresholds |

*A 1-click persona switcher is embedded in the top navigation bar for immediate judge evaluations.*

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js & Express, TypeScript (`tsx server.ts`), RESTful API gateway.
- **AI Risk Engine**: Hybrid Anomaly Scoring Model (Python Isolation Forest reference in `/risk-engine/` and real-time TypeScript execution engine).
- **Blockchain**: Solidity smart contract (`blockchain/CrossPayLedger.sol`) + Drunix-compatible enterprise ledger simulation abstraction (`BlockchainService`).
- **Database**: In-memory persistent database store pre-seeded with 20+ users, 50+ transactions, 7 global currency corridors, and complete audit history.

---

## 6. Project Structure

```
├── blockchain/
│   └── CrossPayLedger.sol      # Solidity smart contract for transaction proofs
├── docs/
│   ├── architecture.md         # Full system & security architecture diagrams
│   ├── api.md                  # REST endpoint definitions
│   ├── security.md             # Threat modeling & off-chain PII isolation
│   └── demo.md                 # 2-3 minute hackathon pitch script for judges
├── risk-engine/
│   ├── model.py                # Python Isolation Forest model definition
│   ├── features.py             # Feature engineering pipeline
│   ├── scoring.py              # Composite risk scoring formulas
│   └── explain.py              # Human-readable justification engine
├── src/
│   ├── components/             # Reusable UI components (Dashboards, Modals, Navbar)
│   ├── server/                 # Express backend, risk engine, database, blockchain service
│   ├── services/               # Frontend API client
│   ├── types/                  # TypeScript interface definitions
│   ├── App.tsx                 # Core application controller
│   ├── main.tsx                # Client bootstrap
│   └── index.css               # Design system & typography tokens
├── server.ts                   # Full-stack dev & production server entry point
├── package.json
└── README.md
```

---

## 7. Running Locally

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
# Clone the repository
git clone https://github.com/example/crosspay-trust.git
cd crosspay-trust

# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 8. Hackathon & Sandbox Disclaimer

> **Important**: This platform is a hackathon innovation prototype built for the Drunix Hackathon in collaboration with Citi. It processes simulated financial transactions in a sandbox environment and interacts with a Drunix-compatible testnet ledger. It does not replace regulated banking infrastructure or process live production funds through NPCI, Citi, or the Reserve Bank of India unless connected to authorized production banking gateways.
