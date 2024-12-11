// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const User = require('../modals/user');

const generateToken = (id , createdAt) => jwt.sign({ id , createdAt}, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id, user.createdAt), // Include createdAt
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   createdAt: user.createdAt,
      // },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id, user.createdAt), // Include createdAt
        // user: {
        //   id: user._id,
        //   name: user.name,
        //   email: user.email,
        //   createdAt: user.createdAt,
        // },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

