const resolvers = {
  Query: {
    getBuilding: async (_, { buildingId }, { Building }) => {
      const building = await Building.findOne({ _id: buildingId });

      return building;
    },
  },
};

module.exports = resolvers;
// export default resolvers;
