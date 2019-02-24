const resolvers = {
  Query: {
    /*
      Retrieves an event with the given object ID.
    */
    getEvent: async (_, { eventId }, { Event }) => {
      const event = await Event.find({ _id: eventId }).populate([
        {
          path: 'eventBuildings',
          type: 'Building',
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
    addEvent: async (
      _,
      {
        eventTitle,
        eventDescription,
        eventStartTime,
        eventEndTime,
        eventAddress,
      },
      { Event }
    ) => {
      // Check if an event with the given name already exists
      const event = Event.findOne({ eventTitle });

      if (event){
        throw new Error(
          `${eventTitle} already exists. Please create an event with a different name.`
        );
      }

      // If an existing event isn't found,
      // then create a new event with the mandatory fields
      const newEvent = new Event({
        eventTitle,
        eventDescription,
        eventStartTime,
        eventEndTime,
        eventAddress,
      }).save();

      return newEvent;
    },
  },
};

module.exports = resolvers;
// export default resolvers;
