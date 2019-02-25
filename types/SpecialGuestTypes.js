const { gql } = require('apollo-server-express');

const typeDef = gql`
  type SpecialGuest {
    _id: ID!
    parentEvent: Event!
    guestName: String!
    guestDescription: String!
    guestSessions: [Session]
  }

  type Query {
    getSpecialGuestsForEvent(eventId: ID!): [SpecialGuest]
  }

  type Mutation {
    addSpecialGuestToEvent(
      eventId: ID!
      guestName: String!
      guestDescription: String!
    ): SpecialGuest!
    addSessionToSpecialGuest(guestId: ID!, sessionId: ID!): SpecialGuest!
  }
`;

module.exports = typeDef;
