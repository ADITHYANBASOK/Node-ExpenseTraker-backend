const Expense = require("../modals/expense");

// const Expense = require('../models/Expense');


exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, category, date, notes } = req.body;
  try {
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      date,
      notes,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
