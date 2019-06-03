const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const getUser = async (token) => {
  if (token){
    // Check the validity of the JWT token sent from the client.
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err){
      // If it cannot be verified, user's session has expired
      throw new AuthenticationError(
        'Your session has ended. Please sign in again'
      );
    }
  }
};

module.exports = {
  createToken,
  getUser,
};
