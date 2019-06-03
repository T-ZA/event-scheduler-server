const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { User, Event, Building, Session, SpecialGuest } = require('./context');
const Util = require('./util');

// Read environment variables from now.json (used in Now deployment)
require('now-env');

/**************Mongoose Configuration/Setup*****************/
// Translates ObjectId to a readable form on save
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};

// Connect to MLab Database
mongoose
  .set('useCreateIndex', true)
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    return console.log('Connected to database');
  })
  .catch((err) => {
    return console.error(`Could not connect to database. Error: ${err}`);
  });

/**************Apollo Server Configuration/Setup*****************/
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: false,
  // Controlling the format of errors returned to UI
  // to have only the name and message
  formatError: (error) => {
    return {
      name: error.name,
      message: error.message.replace('Context creation failed:', ''),
    };
  },
  context: async ({ req }) => {
    // Get reference to JWT token in ApolloClient request
    const token = req.headers.authorization;

    return {
      User,
      Event,
      Building,
      Session,
      SpecialGuest,
      currentUser: await Util.getUser(token), // currentUser is used to determine who is currently signed in
    };
  },
});

// console.log('server', server);

/**************Express Configuration/Setup*****************/
// Express configuration required to get Apollo Server to work for deployment
const app = express();

// Redirect all requests for base URL to hit the '/graphql' extended path
app.get('/', (req, res) => {
  res.redirect('/graphql');
});

// Apply Express server as middleware to Apollo Server
server.applyMiddleware({ app });

// Determine port for Express to listen on for Apollo Server requests
const port = process.env.PORT || 4000;

// Configures Express to listen on the given port
app.listen({ port }, () => {
  return console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
