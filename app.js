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
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-domain.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
module.exports = app;
