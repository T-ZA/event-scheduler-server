const { gql } = require('apollo-server-express');

const typeDef = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
    isAdminUser: Boolean!
    userEvents: [Event]
    userSessions: [Session]
    adminEvents: [Event]
    adminBuildings: [Building]
  }

  type Query {
    getUser(userId: ID!): User!
    getCurrentUser: User
    getAdminEvents(userId: ID!): [Event]
  }

  type Mutation {
    signUpUser(email: String!, password: String!, isAdminUser: Boolean!): Token
    signInUser(
      email: String!
      password: String!
      adminApplication: Boolean
    ): Token
  }
`;

module.exports = typeDef;
