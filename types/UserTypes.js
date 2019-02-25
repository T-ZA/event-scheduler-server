const { gql } = require('apollo-server-express');

const typeDef = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
    userEvents: [Event]
    userSessions: [Session]
    adminEvents: [Event]
    adminBuildings: [Building]
  }

  type Query {
    getUser(userId: ID!): User!
    getCurrentUser(userId: ID!): User
  }

  type Mutation {
    signUpUser(email: String!, password: String!): Token
  }
`;

module.exports = typeDef;
