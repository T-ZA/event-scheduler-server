const { gql } = require('apollo-server-express');

const typeDef = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    isAdminUser: Boolean!
    userEvents: [Event]
    userSessions: [Session]
  }

  type UserSignIn {
    token: String!
    _id: ID!
    email: String!
  }

  type Query {
    getCurrentUser: User
    getAdminEvents(userId: ID!): [Event]
  }

  type Mutation {
    signUpUser(
      username: String!
      email: String!
      password: String!
      isAdminUser: Boolean!
    ): UserSignIn
    signInUser(
      email: String!
      password: String!
      adminApplication: Boolean
    ): UserSignIn
  }
`;

module.exports = typeDef;
