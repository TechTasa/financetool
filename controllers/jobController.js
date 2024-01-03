const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const jobs = await Job.find();
  const userType=req.session.user.userType
  res.render('jobs', { jobs: jobs ,userType });
};

exports.createJob = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  const job = new Job(req.body);
  await job.save();
  res.redirect('/dashboard/jobs');
};

exports.getCreateJob = (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  const userType=req.session.user.userType
  res.render('createJob', { userType });
};

exports.editJob = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }
    const userType=req.session.user.userType
    res.render('editJob', { job: job,userType });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.updateJob = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).send('Job not found');
    }
    res.redirect('/dashboard/jobs');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteJob = async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).send('Job not found');
    }
    res.redirect('/dashboard/jobs');
  } catch (err) {
    res.status(500).send(err.message);
  }
};