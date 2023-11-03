const { RESTDataSource } = require("apollo-datasource-rest");

class UserService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.USER_SERVICE_CONNECTION;
    // this.baseURL = "http://user-service:3002/user";
    // this.baseURL = "http://127.0.0.1:57557/user";
  }

  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
  }

  async getUsersUser() {
    return this.get("usersUser");
  }

  async createUser({ email, username, avatar, contactList }) {
    const response = await this.post(`create`, {
      email,
      username,
      avatar,
      contactList,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getUserInfo({ validatedUser }) {
    const response = await this.get(`info/${validatedUser}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Removed verifyIfPreviousConversationExists method

  async retrieveContactRequests({ validatedUser }) {
    const response = await this.get(`retrieveContactRequests/${validatedUser}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async retrievePendingContactRequests({ validatedUser }) {
    const response = await this.get(
      `retrievePendingContactRequests/${validatedUser}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getOnlineFriends(validatedUser) {
    const response = await this.get(`onlineFriends`, {
      validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.onlineFriends;
  }

  async searchUser({ searchTerm, validatedUser }) {
    const response = await this.post(`searchUser`, {
      searchTerm,
      validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async sendContactRequest({ validatedUser, receiverUsername }) {
    const response = await this.post(`sendContactRequest`, {
      validatedUser,
      receiverUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async acceptContactRequest({ validatedUser, senderUsername }) {
    const response = await this.post(`acceptContactRequest`, {
      validatedUser,
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async rejectContactRequest({ validatedUser, senderUsername }) {
    const response = await this.post(`rejectContactRequest`, {
      validatedUser,
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async deleteContact({ validatedUser, receiverUsername }) {
    const response = await this.post("deleteContact", {
      validatedUser,
      receiverUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async cancelRequest({ validatedUser, receiverUsername }) {
    const response = await this.post(`cancelRequest`, {
      validatedUser,
      receiverUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Removed addConversationIdToParticipantsProfiles method

  async changeUserToOnline({ username }) {
    const response = await this.patch(`changeUserToOnline`, { username });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async changeUserToOffline({ username }) {
    const response = await this.patch(`changeUserToOffline`, { username });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getUserStatuses({ usernames }) {
    const response = await this.post(`getUserStatuses`, { usernames });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.onlineStatuses;
  }

  // API function to get conversations from Express route
  async getConversations({ validatedUser }) {
    const response = await this.get(`getConversations`, { validatedUser });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.conversations;
  }

  async addChat({
    conversationId,
    name,
    participants,
    isGroupalChat,
    username,
  }) {
    const response = await this.post(`addChat`, {
      conversationId,
      name,
      participants,
      isGroupalChat,
      username,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async modifyChatName({ conversationId, newName, participants }) {
    // Make a POST request to modify the chat name
    const response = await this.post(`modifyChatName`, {
      conversationId,
      newName,
      participants,
    });

    // Error Handling: Throw an error if the service returns one
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async addChatMember({
    conversationId,
    nameToAdd,
    participants,
    conversation,
  }) {
    // Make a POST request to add a new chat member
    const response = await this.post(`addChatMember`, {
      conversationId,
      nameToAdd,
      participants,
      conversation, // Added the conversation data
    });

    // Error Handling: Throw an error if the service returns one
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async removeChatMember({ conversationId, nameToRemove, participants }) {
    // Make a POST request to remove a chat member
    const response = await this.post(`removeChatMember`, {
      conversationId,
      nameToRemove,
      participants,
    });

    // Error Handling: Throw an error if the service returns one
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = UserService;
