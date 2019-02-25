const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Token {
    token: String!
  }
`;

module.exports = typeDef;
