const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Guest {
    _id: ID!
    parentEvent: Event!
    guestName: String!
    guestDescription: String!
    guestSessions: [Session]
  }

  type Query {
    getGuestsForEvent(eventId: ID!): [Guest]
  }

  type Mutation {
    addGuestToEvent(
      eventId: ID!
      guestName: String!
      guestDescription: String!
    ): Guest!
    addSessionToGuest(guestId: ID!, sessionId: ID!): Guest!
  }
`;

module.exports = typeDef;
