# CrossPay Trust — API Reference

All endpoints are hosted under `/api`.

## Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with email & password, returns JWT token. |
| `POST` | `/api/auth/register` | Register a new user profile. |
| `GET` | `/api/users/me` | Fetch active user session information. |

## Corridors & FX
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/corridors` | Returns list of supported remittance corridors (US, GB, EU, AE, SG, CA, AU) with live simulated exchange rates and rail fees. |

## Transactions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Query transactions. Supports `search`, `status`, `corridor`, `riskLevel`. |
| `POST` | `/api/transactions` | Initiate new remittance. Runs AI Risk Engine and commits proof to Drunix ledger. |
| `GET` | `/api/transactions/:id` | Get full transaction timeline, risk factors, and blockchain confirmation. |
| `POST` | `/api/transactions/:id/advance` | Step workflow stage forward (Demo mode support). |
| `POST` | `/api/transactions/:id/risk-analysis` | Re-run anomaly detection model. |

## Compliance Officer Actions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/:id/approve` | Compliance Officer approves flagged transaction. |
| `POST` | `/api/transactions/:id/hold` | Place transaction on investigative hold. |
| `POST` | `/api/transactions/:id/request-verification` | Request supplementary documentation from sender. |
| `POST` | `/api/transactions/:id/reject` | Reject transaction and queue for return. |

## Blockchain & Audit
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/blockchain/:transactionId` | Verify cryptographic payload against Drunix ledger root. |
| `GET` | `/api/blockchain-stats` | Retrieve ledger block height, contract address, and consensus health. |
| `GET` | `/api/audit` | Fetch tamper-proof regulatory audit logs. |
| `GET` | `/api/dashboard/summary` | Retrieve aggregated pitch metrics, corridor volume, and completion rates. |

## Hackathon Demo Mode
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/demo/scenarios/:scenarioId` | Instantly trigger Scenario 1 (`scenario_1`), Scenario 2 (`scenario_2`), or Scenario 3 (`scenario_3`). |
