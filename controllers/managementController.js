const User = require('../models/User');

exports.createUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  const { username, password, userType, leadAccess } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists'
      });
    }
    const user = await User.create({ username, password, userType, leadAccess });
    res.redirect('/dashboard/management');
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUsers = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    if (req.session.user.userType === 'agent') {
      return res.status(403).send('Unauthorized');
    }
    const users = await User.find();
    const userType=req.session.user.userType
    res.render('management', { users: users,userType });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.editUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const userType=req.session.user.userType
    res.render('editmanagement', { user: user ,userType});
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/dashboard/management');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/dashboard/management');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
