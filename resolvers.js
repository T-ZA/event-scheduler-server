const path = require('path');
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = fileLoader(path.join(__dirname, './resolvers/'), {
  recursive: true,
  extensions: ['.js'],
});
const resolvers = mergeResolvers(resolversArray);

module.exports = resolvers;
