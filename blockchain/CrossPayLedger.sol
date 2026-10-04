// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossPayLedger
 * @notice Tamper-proof, audit-ready ledger for cross-border transaction proofs and lifecycle states.
 * @dev Designed for Drunix-compatible enterprise blockchain execution or EVM-compatible testnets.
 * Sensitive financial information, recipient bank accounts, and personal identities are kept strictly off-chain.
 * Only cryptographic state proofs, timestamps, and compliance flags reside on-chain.
 */
contract CrossPayLedger {
    enum Status {
        INITIATED,              // 0
        VERIFICATION_PENDING,   // 1
        VERIFIED,               // 2
        RISK_REVIEW,            // 3
        PROCESSING,             // 4
        COMPLIANCE_REVIEW,      // 5
        SETTLEMENT_PENDING,     // 6
        COMPLETED,              // 7
        ON_HOLD,                // 8
        REJECTED                // 9
    }

    struct TransactionProof {
        string transactionId;
        bytes32 payloadHash;       // SHA256 / Keccak256 hash of off-chain transaction payload
        Status status;
        uint256 timestamp;
        uint256 blockNumber;
        address recordedBy;
        bool exists;
        uint256 statusUpdateCount;
    }

    struct StatusAuditItem {
        Status status;
        uint256 timestamp;
        string auditNote;
        address updatedBy;
    }

    address public owner;
    mapping(string => TransactionProof) private ledger;
    mapping(string => StatusAuditItem[]) private statusHistory;
    string[] private allTransactionIds;

    // Events
    event TransactionCreated(
        string indexed transactionId,
        bytes32 indexed payloadHash,
        Status status,
        uint256 timestamp,
        address indexed recordedBy
    );

    event TransactionStatusUpdated(
        string indexed transactionId,
        Status newStatus,
        uint256 timestamp,
        string note,
        address indexed updatedBy
    );

    event TransactionVerified(
        string indexed transactionId,
        bytes32 computedHash,
        bool isMatch,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "CrossPay: Only authorized gateway can invoke");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Records an initial transaction proof on the immutable ledger.
     */
    function recordTransaction(
        string calldata transactionId,
        bytes32 payloadHash,
        Status initialStatus
    ) external onlyOwner {
        require(!ledger[transactionId].exists, "CrossPay: Transaction ID already committed");

        ledger[transactionId] = TransactionProof({
            transactionId: transactionId,
            payloadHash: payloadHash,
            status: initialStatus,
            timestamp: block.timestamp,
            blockNumber: block.number,
            recordedBy: msg.sender,
            exists: true,
            statusUpdateCount: 1
        });

        allTransactionIds.push(transactionId);

        statusHistory[transactionId].push(StatusAuditItem({
            status: initialStatus,
            timestamp: block.timestamp,
            auditNote: "Transaction proof recorded on-chain",
            updatedBy: msg.sender
        }));

        emit TransactionCreated(transactionId, payloadHash, initialStatus, block.timestamp, msg.sender);
    }

    /**
     * @notice Updates the state of an existing transaction upon passing compliance or settlement gates.
     */
    function updateTransactionStatus(
        string calldata transactionId,
        Status newStatus,
        string calldata note
    ) external onlyOwner {
        require(ledger[transactionId].exists, "CrossPay: Transaction does not exist");

        ledger[transactionId].status = newStatus;
        ledger[transactionId].statusUpdateCount += 1;

        statusHistory[transactionId].push(StatusAuditItem({
            status: newStatus,
            timestamp: block.timestamp,
            auditNote: note,
            updatedBy: msg.sender
        }));

        emit TransactionStatusUpdated(transactionId, newStatus, block.timestamp, note, msg.sender);
    }

    /**
     * @notice Verifies whether a given transaction payload hash matches the on-chain recorded root.
     */
    function verifyTransaction(
        string calldata transactionId,
        bytes32 testPayloadHash
    ) external returns (bool isMatch) {
        require(ledger[transactionId].exists, "CrossPay: Transaction does not exist");
        isMatch = (ledger[transactionId].payloadHash == testPayloadHash);

        emit TransactionVerified(transactionId, testPayloadHash, isMatch, block.timestamp);
        return isMatch;
    }

    /**
     * @notice Reads transaction record and proof metadata.
     */
    function getTransactionProof(string calldata transactionId) external view returns (
        string memory txId,
        bytes32 payloadHash,
        Status status,
        uint256 timestamp,
        uint256 blockNumber,
        address recordedBy,
        bool exists
    ) {
        TransactionProof memory record = ledger[transactionId];
        require(record.exists, "CrossPay: Record not found");

        return (
            record.transactionId,
            record.payloadHash,
            record.status,
            record.timestamp,
            record.blockNumber,
            record.recordedBy,
            record.exists
        );
    }

    /**
     * @notice Returns total number of on-chain recorded transactions.
     */
    function getTotalTransactionsCount() external view returns (uint256) {
        return allTransactionIds.length;
    }
}
