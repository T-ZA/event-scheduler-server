const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
    unique: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  eventStartTime: {
    type: Date,
    required: true,
  },
  eventEndTime: {
    type: Date,
    required: true,
  },
  eventAddress: {
    type: String,
    required: true,
  },
  eventBuildings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Building',
  },
  eventSessions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Session',
  },
  eventSessionTags: { type: [String] },
  eventGuests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Guest',
  },
  eventGuestTags: { type: [String] },
});

module.exports = mongoose.model('Event', EventSchema);
