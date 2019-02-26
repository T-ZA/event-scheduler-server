const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Event {
    _id: ID!
    parentUser: User!
    eventTitle: String!
    eventDescription: String!
    eventStartTime: String!
    eventEndTime: String!
    eventAddress: String!
    eventBuildings: [Building]
    eventSessions: [Session]
    eventSessionTags: [String]
    eventGuests: [Guest]
    eventGuestTags: [String]
  }

  type Query {
    getEvent(eventId: ID!): [Event]
  }

  type Mutation {
    createEvent(
      userId: ID!
      eventTitle: String!
      eventDescription: String!
      eventStartTime: String!
      eventEndTime: String!
      eventAddress: String!
    ): Event!
    addBuildingToEvent(eventId: ID!, buildingId: ID!): Event!
    addSessionTagsToEvent(eventId: ID!, sessionTags: [String]!): Event!
    addGuestTagsToEvent(eventId: ID!, guestTags: [String]!): Event!
  }
`;

module.exports = typeDef;
