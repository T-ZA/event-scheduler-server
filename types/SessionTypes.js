const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Session {
    _id: ID!
    parentEvent: Event!
    sessionTitle: String!
    sessionDescription: String!
    sessionLocation: SessionLocation!
    sessionStartTime: String!
    sessionEndTime: String!
    sessionHost: [String]
    sessionTags: [String]
    sessionGuests: [SpecialGuest]
  }

  type SessionLocation {
    _id: ID!
    sessionBuilding: String!
    sessionFloor: String!
    sessionRoom: String!
  }

  type Query {
    getSessionsForEvent(eventId: ID!): [Session]!
  }

  type Mutation {
    addSessionToEvent(
      eventId: ID!
      sessionTitle: String!
      sessionDescription: String!
      sessionLocationBuilding: String!
      sessionLocationFloor: String!
      sessionLocationRoom: String!
      sessionStartTime: String!
      sessionEndTime: String!
    ): Session!
  }
`;

module.exports = typeDef;
