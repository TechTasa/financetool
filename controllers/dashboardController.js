const Lead = require('../models/Lead');

exports.dashboardOverview = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  try {
    const totalLeads = await Lead.countDocuments();
    const today = new Date();
    const todayLeads = await Lead.countDocuments({
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59))
      }
    });
    const userType=req.session.user.userType
    res.render('dashboard', { totalLeads, todayLeads,userType });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
