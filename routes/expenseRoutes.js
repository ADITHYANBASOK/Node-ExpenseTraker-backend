const express = require('express');
const { getExpenses, addExpense, deleteExpense, getDashboardData, getMonthlyExpenses, getCurrentExpenses, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddileware');


const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').delete(protect, deleteExpense);
router.route('/:id').put(protect, updateExpense);
router.route('/dashboard').get(protect, getDashboardData)
router.route('/monthly').get(protect, getMonthlyExpenses)
router.route('/currentMonth').get(protect, getCurrentExpenses)


module.exports = router;
