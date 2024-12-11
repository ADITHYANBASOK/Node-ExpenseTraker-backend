const express = require('express');
const { getBudget, updateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddileware');


const router = express.Router();

router.route('/')
  .get(protect, getBudget)
  .post(protect, updateBudget);

module.exports = router;
