const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { User, Event } = require('./context');

/**************Authentication*****************/
const createToken = (user, secret, expiresIn) => {
  const { _id, username, email, password, isAdminUser } = user;
  return jwt.sign({ _id, username, email, password, isAdminUser }, secret, {expiresIn,});
};

const verifyUser = async (token) => {
  if (token){
    // Check the validity of the JWT token sent from the client.
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err){
      // If it cannot be verified, user's session has expired
      throw new AuthenticationError(
        `Your session has ended. Please sign in again`
      );
    }
  }
};

/**************User*****************/
const isAdminUser = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user){
    throw new Error(`User not found.`);
  } else if (user && !user.isAdminUser){
    throw new Error(`${user.email} is not an admin user.`);
  }

  return user;
};

/**************Event*****************/
const isEventCreatedByUser = async (userId, eventId) => {
  // Verify that the user is an admin user
  const user = await isAdminUser(userId);

  // Verify that the given event actually exists
  const event = await Event.findOne({ _id: eventId });
  if (!event){
    throw new Error(`Event does not exist or is already deleted.`);
  } else if (event.parentUser.find(userId) === undefined){
    throw new Error(`Event was not created by the user ${user.username}`);
  }

  return event;
};

module.exports = {
  createToken,
  verifyUser,
  isAdminUser,
  isEventCreatedByUser,
};
