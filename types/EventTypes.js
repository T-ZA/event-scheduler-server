const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Event {
    _id: ID!
    eventTitle: String!
    eventDescription: String!
    eventStartTime: String!
    eventEndTime: String!
    eventAddress: String!
    eventBuildings: [Building]
    eventSessions: [Session]
    eventSessionTags: [String]
    eventGuests: [SpecialGuest]
    eventGuestTags: [String]
  }

  type Query {
    getEvent(eventId: ID!): [Event]
  }

  type Mutation {
    addEvent(
      eventTitle: String!
      eventDescription: String!
      eventStartTime: String!
      eventEndTime: String!
      eventAddress: String!
    ): Event!
    addEventBuilding(eventId: ID!, buildingId: ID!): Event!
    addEventSessionTags(eventId: ID!, sessionTags: [String]!): Event!
    addEventGuestTags(eventId: ID!, guestTags: [String]!): Event!
  }
`;

module.exports = typeDef;
