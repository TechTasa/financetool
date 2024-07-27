const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email']
  },
  number: {
    type: String,
    required: [true, 'Please provide number']
  },
  salary: {
    type: Number,
    required: [true, 'Please provide salary']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  timeToReach: {
    type: String,
    required: [true, 'Please provide time for when we can reach you']
  },
  reachBy: {
    type: String,
    enum: ['email', 'phone'],
    required: [true, 'Please provide how we can reach you']
  },
  companyName: {
    type: String,
  },
  leadType: {
    type: String,
    enum: ['creditcard', 'personalloan', 'microloan', 'businessloan', 'homeloan','insurance'],
    required: [true, 'Please provide type of lead']
  },
  documents: {
    type: Object,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
