const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, password, userType } = req.body;
  try {
    // Check if a user with the provided username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists'
      });
    }

    // If not, create a new user
    const user = await User.create({ username, password, userType });
    req.session.user = user;
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    const isCorrect = await user.checkPassword(password);
    if (!isCorrect) {
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect username or password'
      });
    }
    req.session.user = user;
    res.redirect('/')
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
