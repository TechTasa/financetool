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
      leads = await Lead.find().populate('assignedTo', 'username');
    } else if (userType === 'agent' || userType === 'partner') {
      leads = await Lead.find({
        $or: [
          { assignedTo: userId },
          { leadType: { $in: leadAccess } }
        ]
      }).populate('assignedTo', 'username');
    } else {
      leads = await Lead.find({
        $and: [
          { leadType: { $in: leadAccess } },
          { $or: [{ assignedTo: userId }, { assignedTo: null }] }
        ]
      }).populate('assignedTo', 'username');
    }

    const agents = await User.find({ userType: 'agent' });
    const partners = await User.find({ userType: 'partner' });

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





  // // New function to handle lead assignment
  // exports.assignLead = async (req, res) => {
  //   if (!req.session.user || req.session.user.userType !== 'admin') {
  //     return res.redirect('/auth/login');
  //   }
  
  //   const { leadId, assignedTo, assignType } = req.body;
  
  //   try {
  //     const lead = await Lead.findById(leadId);
  //     if (!lead) {
  //       req.flash('error', 'Lead not found');
  //       return res.redirect('/dashboard/leads');
  //     }
  
  //     const user = await User.findById(assignedTo);
  //     if (!user || user.userType !== assignType) {
  //       req.flash('error', `Invalid ${assignType} selected`);
  //       return res.redirect('/dashboard/leads');
  //     }
  
  //     lead.assignedTo = assignedTo;
  //     await lead.save();
  //     req.flash('success', `Lead assigned to ${user.username}`);
  //   } catch (err) {
  //     console.error('Error assigning lead:', err);
  //     req.flash('error', err.message);
  //   }
  
  //   res.redirect('/dashboard/leads');
  // };


  // exports.assignLead = async (req, res) => {
  //   if (!req.session.user || req.session.user.userType !== 'admin') {
  //     return res.redirect('/auth/login');
  //   }
  
  //   const { leadId, assignedTo, assignType } = req.body;
  
  //   try {
  //     const lead = await Lead.findById(leadId);
  //     if (!lead) {
  //       req.flash('error', 'Lead not found');
  //       return res.redirect('/dashboard/leads');
  //     }
  
  //     if (assignedTo === '') { // Check if assignedTo is an empty string
  //       lead.assignedTo = null; // Set assignedTo to null
  //     } else {
  //       const user = await User.findById(assignedTo);
  //       if (!user || user.userType !== assignType) {
  //         req.flash('error', `Invalid ${assignType} selected`);
  //         return res.redirect('/dashboard/leads');
  //       }
  //       lead.assignedTo = assignedTo;
  //     }
  
  //     await lead.save();
  //     req.flash('success', `Lead assigned to ${assignedTo === '' ? 'No One' : user.username}`);   //this is showing user is not defined
  //   } catch (err) {
  //     console.error('Error assigning lead:', err);   //this is showing user is not defined
  //     req.flash('error', err.message);
  //   }
  
  //   res.redirect('/dashboard/leads');
  // };


  exports.assignLead = async (req, res) => {
    if (!req.session.user || req.session.user.userType !== 'admin') {
      return res.redirect('/auth/login');
    }
  
    const { leadId, assignedTo, assignType } = req.body;
    let user; // Define user variable here
  
    try {
      const lead = await Lead.findById(leadId);
      if (!lead) {
        req.flash('error', 'Lead not found');
        return res.redirect('/dashboard/leads');
      }
  
      if (assignedTo === '') { // Check if assignedTo is an empty string
        lead.assignedTo = null; // Set assignedTo to null
      } else {
        user = await User.findById(assignedTo); // Assign user here
        if (!user || user.userType !== assignType) {
          req.flash('error', `Invalid ${assignType} selected`);
          return res.redirect('/dashboard/leads');
        }
        lead.assignedTo = assignedTo;
      }
  
      await lead.save();
      req.flash('success', `Lead assigned to ${assignedTo === '' ? 'No One' : user?.username}`); // Use optional chaining (?.) to access user.username
    } catch (err) {
      console.error('Error assigning lead:', err);
      req.flash('error', err.message);
    }
  
    res.redirect('/dashboard/leads');
  };