const Lead = require('../models/Lead');
const User = require('../models/User');

exports.getLeads = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    let leads;
    const userType = req.session.user.userType;
    const userId = req.session.user._id;
    const leadAccess = req.session.user.leadAccess;
    
    if (userType === 'admin' || userType === 'hr') {
      leads = await Lead.find().populate([
        { path: 'assignedTo', select: 'username' },
        { path: 'userId', select: 'username' }
      ]);
     
    } else if (userType === 'agent' || userType === 'partner') {
      leads = await Lead.find({
        $or: [
          { assignedTo: userId },
          { leadType: { $in: leadAccess } }
        ]
      }).populate('assignedTo', 'username');
    } else {
      leads = await Lead.find({
        userId: userId
      }).populate([
        { path: 'assignedTo', select: 'username' },
        { path: 'userId', select: 'username' }
      ]);
    }

    const agents = await User.find({ userType: 'agent' }, 'id username');
    const partners = await User.find({ userType: 'partner' }, 'id username');

    res.render('leads', {
      leads: leads,
      userType: userType,
      agents: agents,
      partners: partners
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.assignLead = async (req, res) => {
  if (!req.session.user || req.session.user.userType !== 'admin') {
    return res.redirect('/auth/login');
  }

  const { leadId, assignedTo, assignType } = req.body;
  let user;

  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      req.flash('error', 'Lead not found');
      return res.redirect('/dashboard/leads');
    }

    if (assignedTo === '') {
      lead.assignedTo = null;
    } else {
      user = await User.findById(assignedTo);
      if (!user || user.userType !== assignType) {
        req.flash('error', `Invalid ${assignType} selected`);
        return res.redirect('/dashboard/leads');
      }
      lead.assignedTo = assignedTo;
    }

    await lead.save();
    req.flash('success', `Lead assigned to ${assignedTo === '' ? 'No One' : user?.username}`);
  } catch (err) {
    console.error('Error assigning lead:', err);
    req.flash('error', err.message);
  }

  res.redirect('/dashboard/leads');
};

// New function to update lead status
exports.updateLeadStatus = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { leadId, status } = req.body;

  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      req.flash('error', 'Lead not found');
      return res.redirect('/dashboard/leads');
    }

    lead.status = status;
    await lead.save();
    req.flash('success', `Lead status updated to ${status}`);
  } catch (err) {
    console.error('Error updating lead status:', err);
    req.flash('error', err.message);
  }

  res.redirect('/dashboard/leads');
};