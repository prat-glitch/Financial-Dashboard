const transactionsmodel = require('../models/transactionsmodel');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { name, amount, type, category, date, description, method } = req.body;

        const newTransaction = new transactionsmodel({
            name: name || description,
            amount,
            type,
            category,
            date: date || Date.now(),
            description: description || name,
            paymentmethod: method || 'upi'
        });

        await newTransaction.save();
        res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create transaction', error: error.message });
    }
};

// Get all transactions
exports.getallTransactions = async (req, res) => {
    try {
        const transactions = await transactionsmodel.find().sort({ date: -1 });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};

// Get transactions by user ID
exports.getTransactionsByUser = async (req, res) => {
    try {
        const transactions = await transactionsmodel.find({
            userid: req.params.userid
        }).sort({ date: -1 });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};

// Get single transaction by id
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await transactionsmodel.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ transaction });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transaction', error: error.message });
    }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await transactionsmodel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction updated', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update transaction', error: error.message });
    }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await transactionsmodel.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
    }
};

// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
    try {
        const transactions = await transactionsmodel.find();
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Get current month transactions
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= currentMonthStart);
        
        const monthlyIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Category breakdown (as array for frontend)
        const categoryMap = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            if (!categoryMap[t.category]) {
                categoryMap[t.category] = 0;
            }
            categoryMap[t.category] += t.amount;
        });
        
        const categoryBreakdown = Object.entries(categoryMap)
            .map(([_id, total]) => ({ _id, total }))
            .sort((a, b) => b.total - a.total);

        // Monthly trend (last 6 months)
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
            
            const monthTxns = transactions.filter(t => {
                const txDate = new Date(t.date);
                return txDate >= monthStart && txDate <= monthEnd;
            });
            
            monthlyTrend.push({
                month: monthName,
                income: monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
                expense: monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
            });
        }

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            monthlyIncome,
            monthlyExpense,
            monthlyBalance: monthlyIncome - monthlyExpense,
            categoryBreakdown,
            monthlyTrend,
            totalTransactions: transactions.length,
            recentTransactions: [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get stats', error: error.message });
    }
};
