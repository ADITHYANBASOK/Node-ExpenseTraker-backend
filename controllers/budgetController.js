// controllers/budgetController.js

const Budget = require("../modals/budget");

// const Budget = require('../models/Budget');

exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user.id });
    res.json(budget || { amount: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBudget = async (req, res) => {
  const { amount } = req.body;
  try {
    let budget = await Budget.findOne({ user: req.user.id });
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ user: req.user.id, amount });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
