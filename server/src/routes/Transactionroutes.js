const transactionRoutes = require("express").Router();
const {
    createTransaction,
    getallTransactions,
    getTransactionsByUser,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
} = require("../controllers/Transactionscontroller");

// Get all transactions
transactionRoutes.get('/', getallTransactions);

// Get transaction statistics
transactionRoutes.get('/stats', getTransactionStats);

// Get transactions by user ID
transactionRoutes.get("/user/:userid", getTransactionsByUser);

// Get single transaction by ID
transactionRoutes.get("/:id", getTransactionById);

// Create a new transaction
transactionRoutes.post("/", createTransaction);

// Update transaction
transactionRoutes.put("/:id", updateTransaction);

// Delete transaction
transactionRoutes.delete("/:id", deleteTransaction);

module.exports = transactionRoutes;
