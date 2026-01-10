const mongoose = require('mongoose');

const transactionschema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    paymentmethod: { 
        type: String, 
        enum: ['cash', 'card', 'upi', 'bank transfer', 'UPI', 'Card', 'Cash', 'Bank Transfer'], 
        default: 'upi' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionschema);
