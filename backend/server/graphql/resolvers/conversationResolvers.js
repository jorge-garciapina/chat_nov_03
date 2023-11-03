const { notifyNewConversation, notifyNewMessage } = require("./pubsub_logic");

const conversationResolvers = {
  Query: {
    getDeliveredToArray: async (
      _source,
      { conversationId, messageIndex },
      { dataSources, token }
    ) => {
      // Validate the user's operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Get the validated user
      const validatedUser = validation.validatedUser;

      // Fetch the 'deliveredTo' array for the specific message in a conversation from data source
      return dataSources.conversationAPI.getDeliveredToArray({
        validatedUser,
        conversationId,
        messageIndex,
      });
    },
    getSeenByArray: async (
      _source,
      { conversationId, messageIndex },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.getSeenByArray({
        validatedUser,
        conversationId,
        messageIndex,
      });
    },

    getConversationInfo: async (
      _source,
      { conversationId },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.getConversationInfo({
        validatedUser,
        conversationId,
      });
    },

    getLastMessage: async (
      _source,
      { conversationId },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;
      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.getLastMessage({
        validatedUser,
        conversationId,
      });
    },
  },

  Mutation: {
    createConversation: async (
      _source,
      { name, participants, isGroupalChat },
      { dataSources, token }
    ) => {
      // Validate the user operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Remove duplicate participants
      const uniqueParticipants = [...new Set(participants)];

      // Validate all unique participants
      await Promise.all(
        uniqueParticipants.map((participant) =>
          dataSources.authAPI.validateMessageReceiver(participant)
        )
      );

      const validatedUser = validation.validatedUser;

      // Add the validated user and ensure all participants remain unique
      participants = [...new Set([...uniqueParticipants, validatedUser])];

      const conversation = await dataSources.conversationAPI.createConversation(
        {
          name,
          validatedUser,
          participants,
          isGroupalChat,
          date: new Date(),
        }
      );

      const conversationId = conversation.conversationId;

      dataSources.userAPI.addChat({
        conversationId,
        name,
        participants,
        isGroupalChat,
        username: validatedUser,
      });

      const conversationInfo =
        await dataSources.conversationAPI.getConversationInfo({
          validatedUser,
          conversationId,
        });

      // Assuming conversationId is defined
      conversationInfo.conversationId = conversationId;

      // Notify the participants of the new conversation
      notifyNewConversation(conversationInfo);

      return conversation;
    },

    addMessageToConversation: async (
      _source,
      { conversationId, content },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      const backendResponse =
        await dataSources.conversationAPI.addMessageToConversation({
          validatedUser,
          conversationId,
          content,
        });

      const receivers = backendResponse.newMessage.receivers;
      const newMessage = backendResponse.newMessage;

      newMessage.conversationId = conversationId;

      const usersToUpdate = [validatedUser, ...receivers];

      const messageInfo = {
        newMessage: newMessage,
        usersToUpdate: usersToUpdate,
      };

      notifyNewMessage(messageInfo);

      // Step 3: Call the corresponding method from the conversation data source
      return backendResponse;
    },

    addNameToDeliveredTo: async (
      _source,
      { conversationId, messageIndex, username },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.addNameToDeliveredTo({
        validatedUser,
        conversationId,
        messageIndex,
        username,
      });
    },

    addNameToSeenBy: async (
      _source,
      { conversationId, messageIndex, username },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.addNameToSeenBy({
        validatedUser,
        conversationId,
        messageIndex,
        username,
      });
    },

    notifyMessageIsDelivered: async (
      _source,
      { conversationIds, username },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.notifyMessageIsDelivered({
        validatedUser,
        conversationIds,
        username,
      });
    },

    deleteMessage: async (
      _source,
      { conversationId, messageIndex },
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.deleteMessage({
        validatedUser,
        conversationId,
        messageIndex,
      });
    },
    ////////////////////////////////////////////////////////////////
    modifyConversationName: async (
      _source,
      { conversationId, newName },
      { dataSources, token }
    ) => {
      // Step 1: Validate the operation for the user using the token
      await dataSources.authAPI.validateUserOperation(token);

      const data = await dataSources.conversationAPI.modifyConversationName({
        conversationId,
        newName,
      });

      const participants = data.participants;

      // TO COMMUNICATE WITH USER SERVICE
      await dataSources.userAPI.modifyChatName({
        conversationId,
        newName,
        participants,
      });

      return data.message;
    },

    addChatMember: async (
      _source,
      { conversationId, nameToAdd },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);

      await dataSources.authAPI.validateMessageReceiver(nameToAdd);

      const data = await dataSources.conversationAPI.addChatMember({
        conversationId,
        nameToAdd,
      });

      const conversation = data.conversation;
      const participants = data.participants;

      // TO COMMUNICATE WITH USER SERVICE
      await dataSources.userAPI.addChatMember({
        conversationId,
        nameToAdd,
        participants,
        conversation,
      });

      return data.message;
    },

    removeChatMember: async (
      _source,
      { conversationId, nameToRemove },
      { dataSources, token }
    ) => {
      await dataSources.authAPI.validateUserOperation(token);

      const data = await dataSources.conversationAPI.removeChatMember({
        conversationId,
        nameToRemove,
      });

      const participants = data.participants;

      // TO COMMUNICATE WITH USER SERVICE
      await dataSources.userAPI.removeChatMember({
        conversationId,
        nameToRemove,
        participants,
      });

      return data.message;
    },

    addAdminToConversation: async (
      _source,
      { conversationId, newAdmins }, // changed newAdmin to newAdmins
      { dataSources, token }
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Validate new admins
      await Promise.all(
        newAdmins.map((name) =>
          dataSources.authAPI.validateMessageReceiver(name)
        )
      );

      // Step 3: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 4: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.addAdminToConversation({
        validatedUser,
        conversationId,
        newAdmins: newAdmins, // changed newAdmin to newAdmins
      });
    },

    ///////////
  },
};

module.exports = conversationResolvers;
