const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const router = require('./routes/budgetRoutes');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};


// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
module.exports = app;
