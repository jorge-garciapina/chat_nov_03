import gql from "graphql-tag";

export const CHANGE_TO_ONLINE = gql`
  subscription ChangeUserToOnline($username: String!) {
    changeUserToOnline(username: $username) {
      username
      status
    }
  }
`;

export const CHANGE_USER_STATUS = gql`
  subscription Subscription($username: String!) {
    changeUserStatus(username: $username) {
      status
      username
    }
  }
`;

export const NEW_CONVERSATION = gql`
  subscription NewConversation($username: String!) {
    newConversation(username: $username) {
      name
      conversationId
    }
  }
`;

export const NOTIFY_NEW_MESSAGE = gql`
  subscription NotifyNewMessage($username: String!) {
    notifyNewMessage(username: $username) {
      newMessage {
        content
        deliveredTo
        index
        receivers
        seenBy
        sender
        isVisible
        conversationId
      }
      usersToUpdate
    }
  }
`;

export const CONTACT_REQUEST_NOTIFICATION = gql`
  subscription ContactRequestNotification($username: String!) {
    contactRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;

export const CANCEL_REQUEST_NOTIFICATION = gql`
  subscription CancelRequestNotification($username: String!) {
    cancelRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;
