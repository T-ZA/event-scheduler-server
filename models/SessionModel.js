const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  parentEvent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sessionTitle: {
    type: String,
    required: true,
  },
  sessionDescription: {
    type: String,
    required: true,
  },
  sessionLocation: {
    sessionBuilding: {
      type: String,
      required: true,
    },
    sessionFloor: {
      type: String,
      required: true,
    },
    sessionRoom: {
      type: String,
      required: true,
    },
  },
  sessionStartTime: {
    type: Date,
    required: true,
  },
  sessionEndTime: {
    type: Date,
    required: true,
  },
  sessionHost: {type: [String],},
  sessionTags: {
    type: [String],
    required: true,
  },
  sessionGuests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SpecialGuest',
  },
});

module.exports = mongoose.model('Session', SessionSchema);
