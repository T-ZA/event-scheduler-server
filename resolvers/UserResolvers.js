const Util = require('../util');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    getUser: async (_, { userId }, { User }) => {
      const user = await User.findOne({ _id: userId }).populate([
        {
          path: 'userEvents',
          ref: 'Event',
        },
        {
          path: 'userSessions',
          ref: 'Session',
        },
        {
          path: 'adminEvents',
          ref: 'Event',
        },
        {
          path: 'userBuildings',
          ref: 'Building',
        },
      ]);

      return user;
    },
    /*
      Checks the current status of which user is signed in. 
      If there is no user signed in, this function returns null.
    */
    getCurrentUser: async (_, args, { User, currentUser }) => {
      // If there is no current user signed in,
      // then return nothing
      if (!currentUser){
        return null;
      }

      // Locate the user document with the email matching the current user
      const user = await User.findOne({ email: currentUser.email }).populate([
        {
          path: 'userEvents',
          model: 'Event',
        },
        {
          path: 'userSessions',
          model: 'Session',
        },
        {
          path: 'adminEvents',
          model: 'Event',
        },
        {
          path: 'adminBuildings',
          model: 'Building',
        },
      ]);

      return user;
    },
  },

  Mutation: {
    /*
      Creates a new user with the given user information. 
      If an existing user with the same email is found,
      then the new user will not be created.
    */
    signUpUser: async (_, { email, password, isAdminUser }, { User }) => {
      // Locate a user with the given email
      const user = await User.findOne({ email });

      // If a user already exists with that email,
      // then throw an Error exception
      // since you can't sign up with an existing email
      if (user){
        throw new Error(`${email} already exists`);
      }

      // Create a new User document with the given username and password
      const newUser = await new User({
        email,
        password,
        isAdminUser,
      }).save();

      // Return a JWT token to the UI for the newly registered user
      // (allows for instant authentication on register)
      return { token: Util.createToken(newUser, process.env.SECRET, '1hr') };
    },
    /*
      Authenticate a user with the given user information.
      If an existing user with the same password isn't found,
      then the user will not be authenticated.
    */
    signInUser: async (_, { email, password, adminApplication }, { User }) => {
      const user = await User.findOne({ email });
      // If the user attempting to sign in doesn't exist,
      // throw an error
      if (!user){
        throw new Error(`User ${email} not found.`);
      }
      // If the user is signing in to the admin application and is not an admin,
      // throw an error
      else if (
        user &&
        adminApplication &&
        user.isAdminUser !== adminApplication
      ){
        throw new Error(
          `${email} is not an admin user. Please sign in with an admin user.`
        );
      }

      // Compare the password being used for sign-in
      // with the stored password for the matching user.
      // If the password doesn't match, throw an error
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword){
        throw new Error('Invalid password');
      }

      return { token: Util.createToken(user, process.env.SECRET, '1hr') };
    },
  },
};

module.exports = resolvers;
