const { gql } = require('apollo-server-express');

const typeDef = gql`
  type Building {
    _id: ID!
    buildingName: String!
    buildingFloors: [Floor]!
  }

  type Floor {
    _id: ID!
    floorName: String!
    floorRooms: [Room]!
  }

  type Room {
    _id: ID!
    roomName: String!
  }

  type Query {
    getBuilding(buildingId: ID!): Building!
  }

  type Mutation {
    addFloorToBuilding(buildingId: ID!, floors: String!): Building!
    addRoomsToFloor(buildingId: ID!, floorId: ID!, room: String!): Building!
  }
`;

module.exports = typeDef;
