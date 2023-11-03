import gql from "graphql-tag";

// Queries
export const GET_CONVERSATION_BY_ID = gql`
  query GetConversationById($id: ID!) {
    getConversationById(id: $id) {
      id
      participants
      messages {
        sender
        receivers
        content
        index
        deliveredTo
        seenBy
      }
    }
  }
`;

export const GET_DELIVERED_TO_ARRAY = gql`
  query GetDeliveredToArray($conversationId: ID!, $messageIndex: Int!) {
    getDeliveredToArray(
      conversationId: $conversationId
      messageIndex: $messageIndex
    ) {
      message
      deliveredTo
    }
  }
`;

export const GET_SEEN_BY_ARRAY = gql`
  query GetSeenByArray($conversationId: ID!, $messageIndex: Int!) {
    getSeenByArray(
      conversationId: $conversationId
      messageIndex: $messageIndex
    ) {
      message
      seenBy
    }
  }
`;
export const CREATE_CONVERSATION = gql`
  mutation CreateConversation(
    $name: String!
    $participants: [String]!
    $isGroupalChat: Boolean!
  ) {
    createConversation(
      name: $name
      participants: $participants
      isGroupalChat: $isGroupalChat
    ) {
      message
      conversationId
    }
  }
`;

export const ADD_MESSAGE_TO_CONVERSATION = gql`
  mutation Mutation($conversationId: ID!, $content: String!) {
    addMessageToConversation(
      conversationId: $conversationId
      content: $content
    ) {
      message
    }
  }
`;

export const ADD_NAME_TO_DELIVERED_TO = gql`
  mutation AddNameToDeliveredTo(
    $conversationId: ID!
    $messageIndex: Int!
    $username: String!
  ) {
    addNameToDeliveredTo(
      conversationId: $conversationId
      messageIndex: $messageIndex
      username: $username
    ) {
      message
      deliveredTo
    }
  }
`;

export const ADD_NAME_TO_SEEN_BY = gql`
  mutation AddNameToSeenBy(
    $conversationId: ID!
    $messageIndex: Int!
    $username: String!
  ) {
    addNameToSeenBy(
      conversationId: $conversationId
      messageIndex: $messageIndex
      username: $username
    ) {
      message
      seenBy
    }
  }
`;

export const NOTIFY_MESSAGE_IS_DELIVERED = gql`
  mutation NotifyMessageIsDelivered(
    $conversationIds: [ID]!
    $username: String!
  ) {
    notifyMessageIsDelivered(
      conversationIds: $conversationIds
      username: $username
    ) {
      message
    }
  }
`;

export const getDynamicConversationInfoQuery = (fields) => {
  // Create GraphQL query string dynamically
  return gql`
    query GetConversationInfo($conversationId: ID!) {
      getConversationInfo(conversationId: $conversationId) {
        ${fields.join("\n")}
      }
    }
  `;
};
