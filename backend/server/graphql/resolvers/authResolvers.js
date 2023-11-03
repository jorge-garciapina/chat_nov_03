const { ApolloError } = require("apollo-server-errors");
const { changeUserStatus } = require("./pubsub_logic");

const authResolvers = {
  Query: {
    users: async (_source, _args, { dataSources }) => {
      return dataSources.authAPI.getUsers();
    },

    validateUserOperation: async (_source, _args, { dataSources, token }) => {
      try {
        return dataSources.authAPI.validateUserOperation(token);
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    validateMessageReceiver: async (_source, { receiver }, { dataSources }) => {
      try {
        return dataSources.authAPI.validateMessageReciever(receiver);
      } catch (error) {
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
  },

  Mutation: {
    registerUser: async (
      _source,
      { email, username, password, avatar },
      { dataSources }
    ) => {
      try {
        // Register the user with the auth service
        const registerResponse = await dataSources.authAPI.registerUser({
          email,
          username,
          password,
        });

        // Create the same user in the user service
        await dataSources.userAPI.createUser({
          email,
          username,
          avatar,
        });

        return registerResponse;
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    loginUser: async (_source, { username, password }, { dataSources }) => {
      try {
        const loggedInUser = await dataSources.authAPI.loginUser({
          username,
          password,
        });

        const userInfo = await dataSources.userAPI.getUserInfo({
          validatedUser: username,
        });

        const contactList = userInfo.contactList;

        changeUserStatus(username, contactList, "ONLINE");

        await dataSources.userAPI.changeUserToOnline({ username });

        return loggedInUser;
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },

    logoutUser: async (_source, { token }, { dataSources }) => {
      try {
        // changeUserToOffline(username);
        const { validatedUser } =
          await dataSources.authAPI.validateUserOperation(token);

        const userInfo = await dataSources.userAPI.getUserInfo({
          validatedUser: validatedUser,
        });

        const contactList = userInfo.contactList;

        changeUserStatus(validatedUser, contactList, "OFFLINE");

        return await dataSources.userAPI.changeUserToOffline({
          username: validatedUser,
        });
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(`Server Error: ${error.message}`, "SERVER_ERROR");
      }
    },

    updateStatusBasedOnView: async (
      _source,
      { token, location },
      { dataSources }
    ) => {
      try {
        // Validate the user's operation by checking their token.
        const { validatedUser } =
          await dataSources.authAPI.validateUserOperation(token);

        // Get the user's info.
        const userInfo = await dataSources.userAPI.getUserInfo({
          validatedUser: validatedUser,
        });

        const contactList = userInfo.contactList;

        // Check if the user is currently on the dashboard.
        if (location === "/dashboard") {
          // If on dashboard, set status to 'ONLINE'.
          changeUserStatus(validatedUser, contactList, "ONLINE");

          // Make API call to change user to 'ONLINE'.
          await dataSources.userAPI.changeUserToOnline({
            username: validatedUser,
          });
        } else {
          // If not on dashboard, set status to 'OFFLINE'.
          changeUserStatus(validatedUser, contactList, "OFFLINE");

          // Make API call to change user to 'OFFLINE'.
          await dataSources.userAPI.changeUserToOffline({
            username: validatedUser,
          });
        }

        // Return the updated status based on the location.
        return { status: location === "DASHBOARD" ? "ONLINE" : "OFFLINE" };
      } catch (error) {
        // Handle errors by throwing an ApolloError with a custom message and code.
        throw new ApolloError(`Server Error: ${error.message}`, "SERVER_ERROR");
      }
    },

    changePassword: async (
      _source,
      { token, oldPassword, newPassword },
      { dataSources }
    ) => {
      try {
        return await dataSources.authAPI.changePassword({
          token,
          oldPassword,
          newPassword,
        });
      } catch (error) {
        // Throw an ApolloError with a custom message and code
        throw new ApolloError(` ${error.message}`, "SERVER_ERROR");
      }
    },
  },
};

module.exports = authResolvers;
