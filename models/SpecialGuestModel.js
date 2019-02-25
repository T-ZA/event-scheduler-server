const mongoose = require('mongoose');

const SpecialGuestSchema = new mongoose.Schema({
  parentEvent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
  guestName: {
    type: String,
    required: true,
  },
  guestDescription: {
    type: String,
    required: true,
  },
  guestSessions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Session',
  },
});

module.exports = mongoose.model('SpecialGuest', SpecialGuestSchema);
