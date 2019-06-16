const Util = require('../util');

const resolvers = {
  Query: {
    /*
      Retrieves an event with the given object ID.
    */
    getEvent: async (_, { eventId }, { Event }) => {
      const event = await Event.findOne({ _id: eventId }).populate([
        {
          path: 'eventBuildings',
          type: 'Building',
        },
        {
          path: 'eventSessions',
          type: 'Session',
        },
        {
          path: 'eventGuests',
          type: 'Guest',
        },
      ]);

      return event;
    },
  },
  Mutation: {
    /*
      Creates a new event with the given event details. If an existing event
      with the same name is found, then the event will not be created.
    */
    createEvent: async (
      _,
      {
        userId,
        eventTitle,
        eventDescription,
        eventStartTime,
        eventEndTime,
        eventAddress,
      },
      { Event }
    ) => {
      await Util.isAdminUser(userId);

      // Check if an event with the given name already exists
      const event = await Event.findOne({ eventTitle });
      if (event){
        throw new Error(
          `${eventTitle} already exists. Please create an event with a different name.`
        );
      }

      // If an existing event isn't found,
      // then create a new event with the mandatory fields
      const newEvent = await new Event({
        parentUser: userId,
        eventTitle,
        eventDescription,
        eventStartTime,
        eventEndTime,
        eventAddress,
      }).save();

      return newEvent;
    },
    /*
      Deletes the given event. The deleted event is returned as a result.
    */
    deleteEvent: async (_, { userId, eventId }, { Event }) => {
      // Verify that the given event actually exists and is created by the user
      await Util.isEventCreatedByUser(userId, eventId);

      // Delete the event from the events colelction
      const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

      return deletedEvent;
    },
  },
};

module.exports = resolvers;
// export default resolvers;
