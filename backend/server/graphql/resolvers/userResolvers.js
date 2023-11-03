const { notifyContactRequest, notifyCancelRequest } = require("./pubsub_logic");

const userResolvers = {
  Query: {
    userInfo: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      const data = await dataSources.userAPI.getUserInfo({ validatedUser });

      const conversationsObj = data.conversations;

      const conversationsWithLastMessagePromises = Object.keys(
        conversationsObj
      ).map(async (conversationId) => {
        // Fetch the last message for the current conversation
        const lastMessage = await dataSources.conversationAPI.getLastMessage(
          conversationId
        );

        // Return the conversation with the last message included
        return {
          conversationId: conversationId,
          ...conversationsObj[conversationId],
          lastMessage: lastMessage,
        };
      });

      // Wait for all promises to resolve
      const conversationsArray = await Promise.all(
        conversationsWithLastMessagePromises
      );

      data.conversations = conversationsArray;

      return data;
    },

    // Resolver to get the names of all conversations a user is part of
    getConversations: async (_source, _args, { dataSources, token }) => {
      // Validate user token
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      // Fetch conversations
      const conversationsObj = await dataSources.userAPI.getConversations({
        validatedUser,
      });

      // Using Promise.all to concurrently fetch the last message for each conversation
      const conversationsWithLastMessagePromises = Object.keys(
        conversationsObj
      ).map(async (conversationId) => {
        // Fetch the last message for the current conversation
        const lastMessage = await dataSources.conversationAPI.getLastMessage(
          conversationId
        );

        // Return the conversation with the last message included
        return {
          conversationId: conversationId,
          ...conversationsObj[conversationId],
          lastMessage: lastMessage,
        };
      });

      // Wait for all promises to resolve
      const conversationsArray = await Promise.all(
        conversationsWithLastMessagePromises
      );

      return conversationsArray;
    },

    searchUser: async (_source, { searchTerm }, { dataSources, token }) => {
      const validatedUser = await dataSources.authAPI.validateUserOperation(
        token
      );

      return dataSources.userAPI.searchUser({ searchTerm, validatedUser });
    },

    retrieveContactRequests: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrieveContactRequests({ validatedUser });
    },

    retrievePendingContactRequests: async (
      _source,
      _args,
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrievePendingContactRequests({
        validatedUser,
      });
    },

    onlineFriends: async (_source, _args, { dataSources, token }) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.getOnlineFriends(validatedUser);
    },

    getUserStatuses: async (_source, { usernames }, { dataSources, token }) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.getUserStatuses({ usernames });
    },
  },

  Mutation: {
    createUser: async (
      _source,
      { email, username, avatar, contactList },
      { dataSources }
    ) => {
      return dataSources.userAPI.createUser({
        email,
        username,
        avatar,
        contactList,
      });
    },

    sendContactRequest: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      notifyContactRequest(validatedUser, receiverUsername);

      return dataSources.userAPI.sendContactRequest({
        validatedUser,
        receiverUsername,
      });
    },

    cancelRequest: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      notifyCancelRequest(validatedUser, receiverUsername);

      return dataSources.userAPI.cancelRequest({
        validatedUser,
        receiverUsername,
      });
    },

    acceptContactRequest: async (
      _source,
      { senderUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.acceptContactRequest({
        validatedUser,
        senderUsername,
      });
    },

    rejectContactRequest: async (
      _source,
      { senderUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.rejectContactRequest({
        validatedUser,
        senderUsername,
      });
    },

    deleteContact: async (
      _source,
      { receiverUsername },
      { dataSources, token }
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.deleteContact({
        validatedUser,
        receiverUsername,
      });
    },

    changeUserToOnline: async (
      _source,
      { username },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOnline({ username });
    },

    changeUserToOffline: async (
      _source,
      { username },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOffline({ username });
    },

    addChat: async (
      _source,
      { conversationId, name, participants, isGroupalChat },
      { dataSources, token }
    ) => {
      // Validate user operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Check validation and extract the validated user
      if (!validation.isValid) {
        return { message: "Unauthorized" };
      }

      const validatedUser = validation.validatedUser;

      try {
        await dataSources.userAPI.addChat({
          conversationId,
          name,
          participants,
          isGroupalChat,
          username: validatedUser,
        });

        return { message: "Chat successfully added" };
      } catch (error) {
        return { message: `Failed to add chat: ${error.message}` };
      }
    },
  },
};

module.exports = userResolvers;
