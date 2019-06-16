const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const TokenExpiredError = require('jsonwebtoken');

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
      message: error.message.replace(
        'Context creation failed:',
        'Server Error:'
      ),
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
      currentUser: await Util.verifyUser(token), // currentUser is used to determine who is currently signed in
    };
  },
});

/**************Express Configuration/Setup*****************/
const app = express();

// Redirect all requests for base URL to hit the '/graphql' extended path
app.get('/', (req, res) => {
  res.redirect('/graphql');
});

// Return new authentication token when an old one is received
app.get('/token/new/:oldToken', async (req, res) => {
  // Extract token information
  const tokenPayload = jwt.decode(req.params.oldToken);
  console.log(
    `Token: ${tokenPayload._id} + ${tokenPayload.email} + ${
      tokenPayload.password
    }`
  );

  let needNewToken = false;

  // Check that the token is valid and expired
  try {
    jwt.verify(req.params.oldToken, process.env.SECRET);
  } catch (err){
    if (err instanceof jwt.TokenExpiredError){
      needNewToken = true;
    } else {
      console.error(err);
      throw new Error(`Error: ${err}`);
    }
  }

  if (needNewToken){
    let newToken = '';

    // Verify that the user in the received token is an actual user
    const user = await User.findOne({ email: tokenPayload.email });

    if (user){
      newToken = Util.createToken(user, process.env.SECRET, '5m');

      console.log(`New Token: ${newToken}`);

      const data = {
        message: `New token generated.`,
        token: newToken,
      };

      res.append('Bearer', newToken);
      res.status(200).send(data);
    }
  } else {
    res.status(404).send(`Token not expired`);
  }
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
