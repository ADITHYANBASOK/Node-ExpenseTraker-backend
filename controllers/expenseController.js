const Expense = require("../modals/expense");

// const Expense = require('../models/Expense');


exports.getExpenses = async (req, res) => {
  try {
    const { limit, sort } = req.query;
    const filters = { user: req.user.id }; // Ensure the query is scoped to the authenticated user

    // Fetch expenses with optional sorting and limiting
    const expenses = await Expense.find(filters)
      .sort(sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 } : {})
      .limit(limit ? parseInt(limit) : 10); // Default limit to 10 if not specified

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, category, date, notes } = req.body;
  try {
    const expense = await Expense.create({
      user: req.user.id, // Ensures the expense is associated with the logged-in user
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



exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming middleware sets `req.user`
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate date ranges
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1); // Start of 6 months ago
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1); // Start of current month
    const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1); // Start of next month

    const filter = {
      user: userId,
      date: { $gte: sixMonthsAgo, $lt: startOfNextMonth },
    };

    console.log('Filter:', filter);

    // Fetch all expenses within the range
    const expenses = await Expense.find(filter);
    console.log('Expenses:', expenses);

    if (!expenses.length) {
      console.warn('No expenses found for the last six months.');
      return res.json({
        monthlyTrend: { labels: [], data: [] },
        categoryBreakdown: { labels: [], data: [] },
      });
    }

    // Calculate monthly trend
    const monthlyTrend = expenses.reduce((acc, expense) => {
      const monthKey = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`; // YYYY-M format
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyTrendLabels = Object.keys(monthlyTrend).sort((a, b) => new Date(a) - new Date(b));
    const monthlyTrendData = monthlyTrendLabels.map((label) => monthlyTrend[label]);

    console.log('Monthly Trend:', { labels: monthlyTrendLabels, data: monthlyTrendData });

    // Filter expenses for the current month
    const currentMonthExpenses = expenses.filter(
      (expense) => expense.date >= startOfCurrentMonth && expense.date < startOfNextMonth
    );

    // Calculate category breakdown for the current month
    const categoryBreakdown = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryBreakdownLabels = Object.keys(categoryBreakdown);
    const categoryBreakdownData = categoryBreakdownLabels.map((label) => categoryBreakdown[label]);

    console.log('Category Breakdown:', { labels: categoryBreakdownLabels, data: categoryBreakdownData });

    // Respond with processed data
    res.json({
      monthlyTrend: {
        labels: monthlyTrendLabels.map((key) => {
          const [year, month] = key.split('-');
          return `${new Date(year, month - 1).toLocaleString('en', { month: 'short' })} ${year}`;
        }),
        data: monthlyTrendData,
      },
      categoryBreakdown: {
        labels: categoryBreakdownLabels,
        data: categoryBreakdownData,
      },
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
