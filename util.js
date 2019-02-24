const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const getUser = async (token) => {
  if (token){
    try {
      // Check the validity of the JWT token sent from the client.
      // If it cannot be
      return await jwt.verify(token, process.env.SECRET);
    } catch (err){
      throw new AuthenticationError(
        'You session has ended. Please sign in again'
      );
    }
  }
};

module.exports = {
  createToken,
  getUser,
};
