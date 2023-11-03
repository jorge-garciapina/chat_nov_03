const { RESTDataSource } = require("apollo-datasource-rest");

class ConversationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.CONVERSATION_SERVICE_CONNECTION;
  }

  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
  }

  async createConversation({
    name,
    validatedUser,
    participants,
    isGroupalChat,
    date,
  }) {
    // Add new fields here

    const response = await this.post("createConversation", {
      name,
      validatedUser,
      participants,
      isGroupalChat,
      date,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async addMessageToConversation({ validatedUser, conversationId, content }) {
    // Make the POST request to add the message to the conversation
    const response = await this.post("addMessageToConversation", {
      validatedUser,
      conversationId,
      content,
    });

    // Error handling
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getDeliveredToArray({ validatedUser, conversationId, messageIndex }) {
    try {
      // Fetch the 'deliveredTo' array by making a GET request to the conversation service
      const response = await this.get(
        `getDeliveredTo/${conversationId}/${messageIndex}`
      );

      // Check for error in the response
      if (response.error) {
        throw new Error(response.error);
      }

      return {
        message: "Successfully fetched the deliveredTo array.",
        deliveredTo: response.deliveredTo,
      };
    } catch (error) {
      // Log the error and throw it to be caught by Apollo Server
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  async getSeenByArray({ validatedUser, conversationId, messageIndex }) {
    try {
      // Performing GET request to fetch the 'seenBy' array of the message in the conversation
      const response = await this.get(
        `getSeenBy/${conversationId}/${messageIndex}`
      );

      // Error handling: if the 'error' key exists in the response
      if (response.error) {
        throw new Error(response.error);
      }

      return {
        seenBy: response.seenBy,
      };
    } catch (error) {
      console.error("An error occurred:", error);
      throw new Error(
        "An error occurred while fetching the seenBy array: " + error.message
      );
    }
  }

  async addNameToDeliveredTo({
    validatedUser,
    conversationId,
    messageIndex,
    username,
  }) {
    // Making a POST request to the corresponding service and route
    const response = await this.post("addNameTodeliveredTo", {
      validatedUser,
      conversationId,
      messageIndex,
      username,
    });

    // Error Handling: Throwing an error if the service returns an error
    if (response.error) {
      throw new Error(response.error);
    }

    // Returning the response object
    return response;
  }

  async addNameToSeenBy({
    validatedUser,
    conversationId,
    messageIndex,
    username,
  }) {
    // Make a POST request to the 'addNameToseenBy' route
    const response = await this.post("addNameToseenBy", {
      validatedUser,
      conversationId,
      messageIndex: Number(messageIndex), // Convert to Number
      username,
    });

    // If the response contains an error, throw it
    if (response.error) {
      throw new Error(response.error);
    }

    // Return the response from the API
    return response;
  }

  async notifyMessageIsDelivered({ conversationIds, username, validatedUser }) {
    // Make POST request to notify that messages have been delivered for multiple conversations
    const response = await this.post("notifyMessageIsDelivered", {
      conversationIds,
      username,
      validatedUser,
    });

    // Check for errors and throw an error if found
    if (response.error) {
      throw new Error(response.error);
    }

    // Return the response from the REST API call
    return response;
  }

  async deleteMessage({ conversationId, messageIndex, validatedUser }) {
    // Step 1: Make a POST request to delete a specific message in a conversation.
    // Pass the required parameters - `conversationId`, `messageIndex`, and `validatedUser`.
    const response = await this.post("/deleteMessage", {
      conversationId,
      messageIndex,
      validatedUser,
    });

    // Step 2: Check for errors in the response. If any are found, throw an error.
    if (response.error) {
      throw new Error(response.error);
    }

    // Step 3: Return the response from the REST API call.
    return response;
  }

  async getConversationInfo({ validatedUser, conversationId }) {
    try {
      // Make a GET request to fetch the conversation information
      const response = await this.get(`getConversationInfo/${conversationId}`);

      // Error handling: if the 'error' key exists in the response
      if (response.error) {
        throw new Error(response.error);
      }

      return {
        name: response.name,
        participants: response.participants,
        isGroupalChat: response.isGroupalChat,
        messages: response.messages,
      };
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  async getLastMessage(conversationId) {
    try {
      // Make a GET request to fetch the last message of the conversation
      const response = await this.get(`getLastMessage/${conversationId}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.lastMessage; // Assuming the API responds with { lastMessage }
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  async modifyConversationName({ validatedUser, conversationId, newName }) {
    // Making a POST request to the corresponding service and route
    const response = await this.post("modifyConversationName", {
      validatedUser,
      conversationId,
      newName,
    });

    // Error Handling: Throwing an error if the service returns an error
    if (response.error) {
      throw new Error(response.error);
    }

    // Returning the response object
    return response;
  }

  async addChatMember({ conversationId, nameToAdd }) {
    // Making a POST request to the corresponding service and route

    const response = await this.post("addChatMember", {
      conversationId,
      nameToAdd,
    });

    // Error Handling: Throwing an error if the service returns an error
    if (response.error) {
      throw new Error(response.error);
    }

    // Returning the response object
    return response;
  }

  async removeChatMember({ validatedUser, conversationId, nameToRemove }) {
    // Making a POST request to the corresponding service and route
    const response = await this.post("removeChatMember", {
      validatedUser,
      conversationId,
      nameToRemove,
    });

    // Error Handling: Throwing an error if the service returns an error
    if (response.error) {
      throw new Error(response.error);
    }

    // Returning the response object
    return response;
  }

  async addAdminToConversation({ validatedUser, conversationId, newAdmins }) {
    // Make the POST request to add the admins to the conversation
    const response = await this.post("addAdmin", {
      validatedUser,
      conversationId,
      newAdmins, // changed newAdmin to newAdmins
    });

    // Error handling
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = ConversationAPI;
