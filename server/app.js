const express = require('express');
require('dotenv').config();  // Load .env FIRST

const connectdb = require('./src/config/db');
const cors = require('cors');

// Routes
const transactionRoutes = require('./src/routes/Transactionroutes');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const dataRoutes = require('./src/routes/dataRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Connect to MongoDB ---
connectdb();

// --- EJS Setup (optional) ---
app.set('view engine', 'ejs');
app.set('views', './src/views');

// --- Test Route ---
app.get('/', (req, res) => {
    res.render('index');
});

// --- API Routes ---
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/budgets', budgetRoutes);

app.use('/',(req, res) =>{
    res.send('API is running....');
})
// --- Start Server ---
const PORT = process.env.PORT || 3000;

// Only listen when not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
