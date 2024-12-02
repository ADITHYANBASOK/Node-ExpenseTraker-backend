// routes/budgetRoutes.js
const express = require('express');
const { getBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddileware');
// const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/')
  .get(protect, getBudget)
  .post(protect, updateBudget);

module.exports = router;
