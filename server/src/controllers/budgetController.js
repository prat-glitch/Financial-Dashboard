const Budget = require('../models/budgetmodel');
const Transaction = require('../models/transactionsmodel');
const Category = require('../models/category');

// Get budget for a specific month/year
const getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = parseInt(month) || currentDate.getMonth() + 1;
        const targetYear = parseInt(year) || currentDate.getFullYear();

        // Find budget for the month
        let budget = await Budget.findOne({ 
            month: targetMonth, 
            year: targetYear 
        });

        // Get categories from database - get ALL categories first, then filter
        let dbCategories = await Category.find({});
        
        // Filter for expense categories (check both 'expense' type and categories without type)
        let categories = dbCategories.filter(c => 
            c.type === 'expense' || !c.type || c.type === undefined
        );
        
        // If filtering resulted in empty, use all categories
        if (categories.length === 0) {
            categories = dbCategories;
        }
        
        // Also get categories that exist in transactions
        const transactionCategoryNames = await Transaction.distinct('category', { type: 'expense' });
        const existingCategoryNames = categories.map(c => c.name);
        
        // Add any transaction categories that aren't already in the list
        transactionCategoryNames.forEach(name => {
            if (name && !existingCategoryNames.includes(name)) {
                categories.push({
                    _id: name,
                    name: name,
                    type: 'expense'
                });
            }
        });
        
        // If still no categories, provide default expense categories
        if (!categories || categories.length === 0) {
            categories = [
                { _id: 'shopping', name: 'Shopping', type: 'expense' },
                { _id: 'food', name: 'Food & Dining', type: 'expense' },
                { _id: 'bills', name: 'Bills & Utilities', type: 'expense' },
                { _id: 'transport', name: 'Transport', type: 'expense' },
                { _id: 'entertainment', name: 'Entertainment', type: 'expense' },
                { _id: 'healthcare', name: 'Healthcare', type: 'expense' },
                { _id: 'travel', name: 'Travel', type: 'expense' },
                { _id: 'other', name: 'Other', type: 'expense' }
            ];
        }

        // Get actual spending for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const spending = await Transaction.aggregate([
            {
                $match: {
                    type: 'expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    spent: { $sum: '$amount' }
                }
            }
        ]);

        // Get total income for the month
        const incomeResult = await Transaction.aggregate([
            {
                $match: {
                    type: 'income',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$amount' }
                }
            }
        ]);

        const totalIncome = incomeResult[0]?.totalIncome || 0;
        const totalSpent = spending.reduce((sum, s) => sum + s.spent, 0);

        // Map spending to categories
        const spendingMap = {};
        spending.forEach(s => {
            spendingMap[s._id] = s.spent;
        });

        res.json({
            budget,
            categories,
            spending: spendingMap,
            totalSpent,
            totalIncome,
            month: targetMonth,
            year: targetYear
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create or update budget
const saveBudget = async (req, res) => {
    try {
        const { month, year, totalBudget, categoryBudgets } = req.body;

        // Validate
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Find existing budget or create new
        let budget = await Budget.findOne({ month, year });

        if (budget) {
            // Update existing
            budget.totalBudget = totalBudget || 0;
            budget.categoryBudgets = categoryBudgets || [];
            budget.updatedAt = new Date();
            await budget.save();
        } else {
            // Create new
            budget = new Budget({
                userid: req.body.userid || '000000000000000000000000', // Default user for now
                month,
                year,
                totalBudget: totalBudget || 0,
                categoryBudgets: categoryBudgets || []
            });
            await budget.save();
        }

        res.json({ message: 'Budget saved successfully', budget });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get savings analysis
const getSavingsAnalysis = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = parseInt(month) || currentDate.getMonth() + 1;
        const targetYear = parseInt(year) || currentDate.getFullYear();

        // Get budget
        const budget = await Budget.findOne({ month: targetMonth, year: targetYear });

        // Get actual spending
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const spending = await Transaction.aggregate([
            {
                $match: {
                    type: 'expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    spent: { $sum: '$amount' }
                }
            }
        ]);

        // Get income
        const incomeResult = await Transaction.aggregate([
            {
                $match: {
                    type: 'income',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$amount' }
                }
            }
        ]);

        const totalIncome = incomeResult[0]?.totalIncome || 0;
        const totalSpent = spending.reduce((sum, s) => sum + s.spent, 0);
        const totalBudget = budget?.totalBudget || 0;
        const allocatedBudget = budget?.categoryBudgets?.reduce((sum, c) => sum + c.amount, 0) || 0;

        // Calculate savings
        const potentialSavings = totalIncome - allocatedBudget;
        const actualSavings = totalIncome - totalSpent;
        const unallocatedBudget = totalBudget - allocatedBudget;

        // Category-wise analysis
        const categoryAnalysis = [];
        const spendingMap = {};
        spending.forEach(s => { spendingMap[s._id] = s.spent; });

        if (budget?.categoryBudgets) {
            budget.categoryBudgets.forEach(cat => {
                const spent = spendingMap[cat.categoryName] || 0;
                const remaining = cat.amount - spent;
                const percentage = cat.amount > 0 ? Math.round((spent / cat.amount) * 100) : 0;
                
                categoryAnalysis.push({
                    categoryName: cat.categoryName,
                    budgeted: cat.amount,
                    spent,
                    remaining,
                    percentage,
                    status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
                });
            });
        }

        res.json({
            month: targetMonth,
            year: targetYear,
            totalIncome,
            totalBudget,
            allocatedBudget,
            unallocatedBudget,
            totalSpent,
            potentialSavings,
            actualSavings,
            categoryAnalysis,
            savingsRate: totalIncome > 0 ? Math.round((actualSavings / totalIncome) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const { month, year } = req.params;
        
        const budget = await Budget.findOneAndDelete({ 
            month: parseInt(month), 
            year: parseInt(year) 
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getBudget,
    saveBudget,
    getSavingsAnalysis,
    deleteBudget
};
