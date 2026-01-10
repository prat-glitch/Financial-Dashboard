const express = require('express');
const router = express.Router();
const {
    getBudget,
    saveBudget,
    getSavingsAnalysis,
    deleteBudget
} = require('../controllers/budgetController');

// Get budget for a month/year
router.get('/', getBudget);

// Get savings analysis
router.get('/analysis', getSavingsAnalysis);

// Create or update budget
router.post('/', saveBudget);

// Delete budget
router.delete('/:month/:year', deleteBudget);

module.exports = router;
