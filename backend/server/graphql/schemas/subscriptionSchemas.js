const { gql } = require("apollo-server-express");

const subscriptionSchemas = gql`
  type UserStatus {
    username: String!
    status: String!
    contactList: [String]
  }
  type Conversation {
    conversationId: String!
    name: String!
    participants: [String]!
  }

  type Query {
    dummy: String
  }

  type Message {
    sender: String!
    receivers: [String!]!
    content: String!
    index: Int!
    deliveredTo: [String!]
    seenBy: [String!]
    isVisible: Boolean
  }

  type MessageNotification {
    newMessage: Message!
    usersToUpdate: [String!]!
  }

  type Mutation {
    changeFriendStatus(username: String!, status: String!): UserStatus
  }

  type ContactRequestNotification {
    sender: String!
    receiver: String!
  }

  type CancelRequestNotification {
    sender: String!
    receiver: String!
  }

  type Subscription {
    changeUserStatus(username: String!): UserStatus
    newConversation(username: String!): Conversation
    notifyNewMessage(username: String!): MessageNotification
    contactRequestNotification(username: String!): ContactRequestNotification
    cancelRequestNotification(username: String!): CancelRequestNotification
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = subscriptionSchemas;
