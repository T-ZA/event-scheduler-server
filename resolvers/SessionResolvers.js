const resolvers = {
  Mutation: {
    addSessionToEvent: async (
      _,
      {
        eventId,
        sessionTitle,
        sessionDescription,
        sessionLocation,
        sessionStartTime,
        sessionEndTime,
      },
      { Event }
    ) => {
      const newSession = {
        sessionTitle,
        sessionDescription,
        sessionLocation,
        sessionStartTime,
        sessionEndTime,
      };

      const event = Event.findOneAndUpdate(
        { _id: eventId },
        { $push: { eventSessions: { $each: [newSession], $position: 0 } } },
        { new: true }
      ).populate([
        {
          path: 'eventBuildings',
          type: 'Building',
        },
      ]);

      // const existingSession = event.eventSessions.filter((session) => {
      //   session.sessionTitle === sessionTitle &&
      //     session.sessionStartTime === sessionStartTime;
      // });

      // if (existingSession){
      //   throw new Error(
      //     `${sessionTitle} already exists for this given date and time.`
      //   );
      // }

      return event.eventSessions[0];
    },
  },
};

module.exports = resolvers;
// export default resolvers;
