const express = require('express');
const { getExpenses, addExpense, deleteExpense, getDashboardData } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddileware');
// const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').delete(protect, deleteExpense);
router.route('/dashboard').get(protect, getDashboardData)
module.exports = router;
