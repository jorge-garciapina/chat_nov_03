const conversationSchemas = `#graphql
type Conversation {
  id: ID!
  name: String!
  participants: [String]!
  isGroupalChat: Boolean!
  date: String!          
  messages: [Message]!
}

type Message {
  sender: String!
  receivers: [String]!
  content: String!
  index: Int!
  deliveredTo: [String]!
  seenBy: [String]!
  conversationId: String!
}

type ConversationCreationResponse {
  message: String!
  conversationId: ID!
}

type MessageAdditionResponse {
  message: String!
  newMessage: Message!
}

type DeliveredToResponse {
  message: String!
  deliveredTo: [String]!
}

type SeenByResponse {
  message: String!
  seenBy: [String]!
}

type MultipleConversationsResponse {
  message: String!
}

type ConversationInfo {
  name: String!
  participants: [String]!
  isGroupalChat: Boolean!
  messages: [Message]!
}

type DeleteMessageResponse {
  message: String!
}

type LastMessage {
  sender: String!
  content: String!
  receivers: [String]!
  deliveredTo: [String]!
  seenBy: [String]!
  index: Int!
  isVisible: Boolean!
}

type Query {
  getConversationById(id: ID!): Conversation
  getDeliveredToArray(conversationId: ID!, messageIndex: Int!): DeliveredToResponse
  getSeenByArray(conversationId: ID!, messageIndex: Int!): SeenByResponse
  getConversationInfo(conversationId: ID!): ConversationInfo
  getLastMessage(conversationId: ID!): LastMessage


}

type AdminAdditionResponse {
  message: String!
  admins: [String]!
}

type Mutation {
  createConversation(name: String!, participants: [String]!, isGroupalChat: Boolean!): ConversationCreationResponse! 
  addMessageToConversation(conversationId: ID!, content: String!): MessageAdditionResponse!
  addNameToDeliveredTo(conversationId: ID!, messageIndex: Int!, username: String!): DeliveredToResponse!
  addNameToSeenBy(conversationId: ID!, messageIndex: Int!, username: String!): SeenByResponse!
  notifyMessageIsDelivered(conversationIds: [ID]!, username: String!): MultipleConversationsResponse!
  deleteMessage(conversationId: ID!, messageIndex: String!): DeleteMessageResponse!
  modifyConversationName(conversationId: ID!, newName: String!): String!
  addChatMember(conversationId: ID!, nameToAdd: String!): String!
  removeChatMember(conversationId: ID!, nameToRemove: String!): String!
  addAdminToConversation(conversationId: ID!, newAdmins: [String]!): AdminAdditionResponse!

}
`;

module.exports = conversationSchemas;
