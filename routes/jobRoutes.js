const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.get('/create', jobController.getCreateJob);
router.post('/create', jobController.createJob);
router.get('/edit/:id', jobController.editJob);
router.post('/edit/:id', jobController.updateJob);
router.post('/delete/:id', jobController.deleteJob);
module.exports = router;
