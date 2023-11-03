import { gql } from "@apollo/client";

export const INFO_QUERY = gql`
  query UserInfo {
    userInfo {
      avatar
      pendingContactRequests {
        receiver
      }
      receivedContactRequests {
        sender
      }
      rejectedContactRequests {
        sender
      }
      username
      contactList

      conversations {
        conversationId
        name
        lastMessage {
          sender
          content
        }
      }
    }
  }
`;

// Define the DELETE_CONTACT_MUTATION
export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteContact($receiverUsername: String!) {
    deleteContact(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUser($searchTerm: String) {
    searchUser(searchTerm: $searchTerm) {
      username
      avatar
    }
  }
`;

export const SEND_CONTACT_REQUEST = gql`
  mutation SendContactRequest($receiverUsername: String!) {
    sendContactRequest(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const RETRIEVE_PENDING_CONTACT_REQUESTS = gql`
  query RetrievePendingContactRequests {
    retrievePendingContactRequests
  }
`;

export const CANCEL_CONTACT_REQUEST = gql`
  mutation CancelContactRequest($receiverUsername: String!) {
    cancelRequest(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const RETRIEVE_CONTACT_REQUESTS = gql`
  query RetrieveContactRequests {
    retrieveContactRequests
  }
`;

export const ACCEPT_CONTACT_REQUEST_MUTATION = gql`
  mutation AcceptContactRequest($senderUsername: String!) {
    acceptContactRequest(senderUsername: $senderUsername) {
      message
    }
  }
`;

export const REJECT_CONTACT_REQUEST_MUTATION = gql`
  mutation RejectContactRequest($senderUsername: String!) {
    rejectContactRequest(senderUsername: $senderUsername) {
      message
    }
  }
`;

export const GET_USER_STATUS_QUERY = gql`
  query GetUserStatuses($usernames: [String!]!) {
    getUserStatuses(usernames: $usernames) {
      username
      onlineStatus
    }
  }
`;

export const GET_CONVERSATIONS_QUERY = gql`
  query GetConversations {
    getConversations {
      conversationId
      name
      lastMessage {
        content
        sender
      }
    }
  }
`;
