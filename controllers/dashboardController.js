// const Lead = require('../models/Lead');

// exports.dashboardOverview = async (req, res) => {
//   // Check if user is logged in
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }

//   try {
//     const today = new Date();
//     const totalLeads = await Lead.countDocuments();
//     const todayLeads = await Lead.countDocuments({
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });

//     // Leads by Type (All Time)
//     const personalLoanAllTime = await Lead.countDocuments({ leadType: 'personalloan' });
//     const creditCardAllTime = await Lead.countDocuments({ leadType: 'creditcard' });
//     const microLoanAllTime = await Lead.countDocuments({ leadType: 'microloan' });
//     const businessLoanAllTime = await Lead.countDocuments({ leadType: 'businessloan' });
//     const homeLoanAllTime = await Lead.countDocuments({ leadType: 'homeloan' });
//     const insuranceAllTime = await Lead.countDocuments({ leadType: 'insurance' });

//     // Leads by Type (Today)
//     const personalLoanToday = await Lead.countDocuments({
//       leadType: 'personalloan',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const creditCardToday = await Lead.countDocuments({
//       leadType: 'creditcard',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const microLoanToday = await Lead.countDocuments({
//       leadType: 'microloan',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const businessLoanToday = await Lead.countDocuments({
//       leadType: 'businessloan',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const homeLoanToday = await Lead.countDocuments({
//       leadType: 'homeloan',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const insuranceToday = await Lead.countDocuments({
//       leadType: 'insurance',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });

//     // Leads by Status (All Time)
//     const pendingAllTime = await Lead.countDocuments({ status: 'pending' });
//     const inProgressAllTime = await Lead.countDocuments({ status: 'in_progress' });
//     const doneAllTime = await Lead.countDocuments({ status: 'done' });
//     const rejectedAllTime = await Lead.countDocuments({ status: 'rejected' });
//     const onHoldAllTime = await Lead.countDocuments({ status: 'on_hold' });

//     // Leads by Status (Today)
//     const pendingToday = await Lead.countDocuments({
//       status: 'pending',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const inProgressToday = await Lead.countDocuments({
//       status: 'in_progress',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const doneToday = await Lead.countDocuments({
//       status: 'done',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const rejectedToday = await Lead.countDocuments({
//       status: 'rejected',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });
//     const onHoldToday = await Lead.countDocuments({
//       status: 'on_hold',
//       createdAt: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lt: new Date(today.setHours(23, 59, 59))
//       }
//     });

//     res.render('dashboard', { 
//       totalLeads, 
//       todayLeads, 
//       personalLoanAllTime, 
//       creditCardAllTime, 
//       microLoanAllTime, 
//       businessLoanAllTime, 
//       homeLoanAllTime, 
//       insuranceAllTime, 
//       personalLoanToday, 
//       creditCardToday, 
//       microLoanToday, 
//       businessLoanToday, 
//       homeLoanToday, 
//       insuranceToday, 
//       pendingAllTime, 
//       inProgressAllTime, 
//       doneAllTime, 
//       rejectedAllTime, 
//       onHoldAllTime, 
//       pendingToday, 
//       inProgressToday, 
//       doneToday, 
//       rejectedToday, 
//       onHoldToday, 
//       userType: req.session.user.userType,
//       userName:req.session.user.username
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };
const Lead = require('../models/Lead');

exports.dashboardOverview = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  try {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59));

    const totalLeads = await Lead.countDocuments();
    const todayLeads = await Lead.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });

    const leadTypes = [
      'creditcard', 'personalloan', 'microloan', 'businessloan', 'homeloan', 
      'automobileloan', 'educationloan', 'propertyloan', 'productloan', 
      'serviceloan', 'insurance'
    ];

    let leadTypeCounts = {};

    for (let type of leadTypes) {
      leadTypeCounts[type] = {
        allTime: await Lead.countDocuments({ leadType: type }),
        today: await Lead.countDocuments({
          leadType: type,
          createdAt: { $gte: todayStart, $lt: todayEnd }
        })
      };
    }

    const statuses = ['pending', 'in_progress', 'done', 'rejected', 'on_hold'];
    let statusCounts = {};

    for (let status of statuses) {
      statusCounts[status] = {
        allTime: await Lead.countDocuments({ status: status }),
        today: await Lead.countDocuments({
          status: status,
          createdAt: { $gte: todayStart, $lt: todayEnd }
        })
      };
    }

    res.render('dashboard', { 
      totalLeads, 
      todayLeads, 
      leadTypeCounts,
      statusCounts,
      userType: req.session.user.userType,
      userName: req.session.user.username
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};