const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username']
  },
  password: {
    type: String,
    required: [true, 'Please provide password']
  },
  userType: {
    type: String,
    enum: ['admin', 'agent', 'hr','blog writer'],
    required: [true, 'Please provide user type']
  },
  leadAccess: {
    type: Array,
    default: []
  }
});


UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
