const Lead = require('../models/Lead');
const User = require('../models/User');

exports.getLeads = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
    try {
      let leads;
      const userType=req.session.user.userType;
      const leadAccess=req.session.user.leadAccess
      if (userType === 'admin') {
        leads = await Lead.find();
      } else if (userType === 'hr') {
        leads = await Lead.find();
      }else{
        leads = await Lead.find({ leadType: { $in: leadAccess } });
      }
      res.render('leads', { leads: leads,userType });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  };
  