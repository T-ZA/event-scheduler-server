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
      { Event, User }
    ) => {
      // Verify the user trying to create the event
      const user = await User.findOne({ _id: userId });
      if (!user){
        throw new Error(`User not found.`);
      } else if (user && !user.isAdminUser){
        throw new Error(`${user.email} is not an admin user.`);
      }

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

      // Update the adminEvents of the user with the newly created event
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { adminEvents: { $each: [newEvent._id] } } },
        { new: true }
      ).populate([
        {
          path: 'userEvents',
          model: 'Event',
        },
        {
          path: 'userSessions',
          model: 'Session',
        },
        {
          path: 'adminEvents',
          model: 'Event',
        },
        {
          path: 'adminBuildings',
          model: 'Building',
        },
      ]);

      return newEvent;
    },
    deleteEvent: async (_, { userId, eventId }, { User, Event }) => {
      // Verify the user trying to create the event
      const user = await User.findOne({ _id: userId });
      if (!user){
        throw new Error(`User not found.`);
      } else if (user && !user.isAdminUser){
        throw new Error(`${user.email} is not an admin user.`);
      }

      // Verify that the given event actually exists
      const event = await Event.findOne({ _id: eventId });
      if (!event){
        throw new Error(`Event does not exist or is already deleted.`);
      }

      // Verify that the given event is created by the user
      const eventIndex = await user.adminEvents.indexOf(eventId);
      if (eventIndex === -1){
        throw new Error(`Event was not created by the user ${user.username}`);
      }

      // Delete the event from the events colelction
      const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

      // Removes the given eventId from the user's adminEvents array
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { adminEvents: eventId } },
        { new: true }
      );

      return 1;
    },
  },
};

module.exports = resolvers;
// export default resolvers;
