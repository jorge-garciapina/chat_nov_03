const userSchemas = `#graphql
  type ExampleUser {
    email: String
    username: String
    password: String
  }



  type UserCreationResponse {
    message: String
  }

  type UserSearchResult {
    username: String
    avatar: String
  }


  type LastMessage {
  sender: String
  content: String
  receivers: [String]
  deliveredTo: [String]
  seenBy: [String]
  index: Int
  isVisible: Boolean
  _id: String
}

type Conversation {
  conversationId: String!
  name: String!
  participants: [String!]!
  isGroupalChat: Boolean!
  lastMessage: LastMessage
}
  
type ContactRequest {
    sender: String
    date: String
    status: String
}

type PendingContactRequest {
    receiver: String
    date: String
    status: String
}

type UserInfo {
    email: String
    username: String
    contactList: [String]
    avatar: String
    receivedContactRequests: [ContactRequest]
    rejectedContactRequests: [ContactRequest]
    pendingContactRequests: [PendingContactRequest]
    conversations: [Conversation]

}

  type Query {
    usersUser: [ExampleUser]
    userInfo: UserInfo
    searchUser(searchTerm: String, validatedUser: String): [UserSearchResult]
    retrieveContactRequests: [String]
    retrievePendingContactRequests: [String]
    onlineFriends: [String]
    getUserStatuses(usernames: [String!]!): [OnlineStatusResponse]
    getConversations: [Conversation]
    }
      
  type OnlineStatusResponse {
    username: String!
    onlineStatus: Boolean
    }

  type Mutation {
    createUser(email: String, username: String, avatar: String, contactList: [String]): UserCreationResponse
    sendContactRequest(receiverUsername: String!): MessageResponse
    changeUserToOnline(username: String!): MessageResponse
    changeUserToOffline(username: String!): MessageResponse
    acceptContactRequest(senderUsername: String!): UserCreationResponse
    rejectContactRequest(senderUsername: String): RejectionResponse
    deleteContact(receiverUsername: String!): DeletionResponse
    cancelRequest(receiverUsername: String): UserCreationResponse
    addChat(conversationId: String!, name: String!, participants: [String!]!, isGroupalChat: Boolean!): AddChatResponse
  }

  type AddChatResponse {
  message: String
}

  type DeletionResponse {
    message: String
  }

  type RejectionResponse {
    message: String
  }

  type MessageResponse {
    message: String
  }
`;

module.exports = userSchemas;
