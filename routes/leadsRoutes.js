const express = require('express');
const leadsController = require('../controllers/leadsController');

const router = express.Router();

router.get('/', leadsController.getLeads);
router.post('/assign-lead', leadsController.assignLead);

module.exports = router;
