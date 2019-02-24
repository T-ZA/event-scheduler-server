const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
  buildingName: {
    type: String,
    required: true,
  },
  buildingFloors: [
    // Single floor definition. Matches the Floor GQL type definition
    {
      floorName: {
        type: String,
        required: true,
      },
      floorRooms: [
        // Single room definition. Matches the Room GQL type definition
        {
          roomName: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Building', BuildingSchema);
