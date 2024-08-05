const User = require('../models/User');
const https = require('https');

exports.signup = async (req, res) => {
  const { username, email, password, userType, phone, countryCode } = req.body;
  try {
    // Check if a user with the provided username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username or email already exists'
      });
    }
    // Check if a user with the provided phone number already exists
    const existingPhone = await User.findOne({ phone, countryCode });
    if (existingPhone) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number already exists'
      });
    }
    // Create a new user
    const user = await User.create({ username, email, password, userType, phone, countryCode });
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.verifyPhone = (req, res) => {
  const { user_json_url } = req.body;

  https.get(user_json_url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        const user_country_code = jsonData.user_country_code;
        const user_phone_number = jsonData.user_phone_number;

        res.json({
          success: true,
          phone: user_phone_number,
          countryCode: user_country_code
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ success: false, message: 'Error processing phone verification' });
      }
    });
  }).on("error", (err) => {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  });
};

exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    // Find user by username, email, or phone
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
        { phone: usernameOrEmail }
      ]
    });

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
        message: 'Incorrect username/email/phone or password'
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
