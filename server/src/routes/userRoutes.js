const userRoutes = require('express').Router();
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteAccount
} = require('../controllers/userController');

// Get user profile
userRoutes.get('/:id', getUserProfile);

// Update user profile
userRoutes.put('/:id', updateUserProfile);

// Change password
userRoutes.put('/:id/password', changePassword);

// Soft delete account
userRoutes.delete('/:id', deleteAccount);

module.exports = userRoutes;
