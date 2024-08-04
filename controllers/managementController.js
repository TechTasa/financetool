const User = require('../models/User');

// exports.createUser = async (req, res) => {
//   // Check if user is logged in
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }
//   const { username, password, userType, leadAccess,phone,countryCode } = req.body;
//   try {

//     // Check if a user with the provided username already exists
//     const existingUsername = await User.findOne({ username });
//     if (existingUsername) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Username already exists'
//       });
//     }

//     // Check if a user with the provided phone number already exists
//     const existingPhone = await User.findOne({ phone, countryCode });
//     if (existingPhone) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Phone number already exists'
//       });
//     }
    
//     const user = await User.create({ username, password, userType, leadAccess ,phone,countryCode});
//     res.redirect('/dashboard/management');
//   } catch (err) {
//     res.status(400).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };


exports.createUser = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  const { username, password, userType, leadAccess, phone, countryCode } = req.body;
  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render('createmanagement', { 
        error: 'Username already exists',
        formData: req.body,
        userType:req.session.user.userType  // Pass back the form data
      });
    }

    const existingPhone = await User.findOne({ phone, countryCode });
    if (existingPhone) {
      return res.render('createmanagement', { 
        error: 'Phone number already exists',
        formData: req.body,
        userType:req.session.user.userType  // Pass back the form data
      });
    }

    const user = await User.create({ username, password, userType, leadAccess, phone, countryCode });
    res.redirect('/dashboard/management');
  } catch (err) {
    res.render('createmanagement', { 
      error: err.message,
      formData: req.body,
      userType:req.session.user.userType  // Pass back the form data
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
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Check if leadAccess checkboxes are present in the request body
    if (req.body.leadAccess) {
      // If present, update the leadAccess array
      user.leadAccess = req.body.leadAccess;
    } else {
      // If not present, reset the leadAccess array to empty
      user.leadAccess = [];
    }
    // Update the user document
    await user.save();
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
