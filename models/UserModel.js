const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // Bookmarked events when using the regular user application
  userEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Event',
  },
  // Bookmarked sessions when using the regular user application
  userSessions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Session',
  },
  // Denotes whether a user is an admin user or not
  isAdminUser: {
    type: Boolean,
    required: true,
    default: '0',
  },
  // Events that the admin user has created (allows them to edit it)
  adminEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Event',
  },
  // Buildings that the user has created (allows for reuse in future events)
  adminBuildings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Building',
  },
});

// Hash password so it can't be seen w/ access to database
UserSchema.pre('save', function (next) {
  // Continue in the chain if the password is already set
  if (!this.isModified('password')){
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
