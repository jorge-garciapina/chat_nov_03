const initialState = {
  userInfo: {
    username: null,
    contactList: [],
    pendingCR: [],
    contactRequests: [],
  },
  onlineFriends: [],
  notifications: [],
  conversation: {
    conversationId: null,
    interlocutors: [],
    messages: [],
  },
  conversations: [],
};
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      const newUser = action.payload.username;

      // Create a new notification when a user logs in
      const newNotification = {
        message: `${newUser} is online`,
      };

      // Check if the notification already exists in the notifications array
      const notificationExists = state.notifications.some(
        (notification) => notification.message === newNotification.message
      );

      let updatedNotifications = state.notifications;
      if (!notificationExists) {
        updatedNotifications = [...state.notifications, newNotification];
      }

      if (!newUser) {
        updatedNotifications = [...state.notifications];
      }

      // Check if the username already exists in onlineFriends
      if (!state.onlineFriends.includes(newUser) && !!newUser) {
        return {
          ...state,
          username: newUser,
          onlineFriends: [...state.onlineFriends, newUser],
          notifications: updatedNotifications,
        };
      } else {
        // If the user is already in the onlineFriends array, return the state with possibly updated notifications
        return {
          ...state,
          username: newUser,
          notifications: updatedNotifications,
        };
      }

    case "LOGOUT":
      const logoutUser = action.payload.username;

      // Check if the username exists in onlineFriends
      if (state.onlineFriends.includes(logoutUser)) {
        // Filter the user out of the onlineFriends list
        const updatedUsers = state.onlineFriends.filter(
          (user) => user !== logoutUser
        );
        return {
          ...state,
          username: null, // Clear the current user as the user has logged out
          onlineFriends: updatedUsers,
        };
      } else {
        // If the user isn't in the onlineFriends array, just return the state as it is
        return state;
      }

    case "UPDATE_USER_INFO":
      const {
        username,
        contactList,
        receivedContactRequests,
        conversations: updatedConversations,
        pendingContactRequests: updatedPendingContactRequests, // New variable to handle the updated pending contact requests
      } = action.payload;

      return {
        ...state,
        userInfo: {
          ...state.userInfo, // Spread existing userInfo to preserve other properties
          username,
          contactList,
          contactRequests: receivedContactRequests, // Update the contactRequests
          pendingCR: updatedPendingContactRequests, // Update the pending contact requests
        },
        conversations: updatedConversations,
      };
    case "DEFINE_INTERLOCUTOR":
      const { interlocutors } = action.payload;
      return {
        ...state,
        conversation: {
          ...state.conversation,
          interlocutors,
        },
      };

    case "INTERLOCUTOR_IS_ONLINE":
      const onlineUser = action.payload.interlocutor;

      // Check if interlocutor is not already in onlineFriends
      if (!state.onlineFriends.includes(onlineUser)) {
        return {
          ...state,
          onlineFriends: [...state.onlineFriends, onlineUser],
        };
      }
      return state; // If interlocutor is already in onlineFriends, just return the state

    case "UPDATE_CONVERSATIONS":
      const { conversations } = action.payload;
      return {
        ...state,
        conversations,
      };

    case "ADD_NEW_CONVERSATION":
      const { newConversation } = action.payload;

      // Check if the conversation already exists
      const conversationExists = state.conversations.some(
        (conversation) => conversation.name === newConversation.name
      );

      if (!conversationExists) {
        return {
          ...state,
          conversations: [...state.conversations, newConversation],
        };
      } else {
        return state;
      }
    case "UPDATE_MESSAGES":
      const { messages } = action.payload;
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages,
        },
      };

    case "APPEND_MESSAGE":
      const { message } = action.payload;
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, message],
        },
      };

    case "SET_SELECTED_CONVERSATION_ID":
      return {
        ...state,
        conversation: {
          ...state.conversation,
          conversationId: action.payload.conversationId,
        },
      };

    case "UPDATE_LAST_MESSAGE": {
      const { conversationId, lastMessage } = action.payload;
      return {
        ...state,
        // Map over the conversations array to update the lastMessage of the matched conversation
        conversations: state.conversations.map(
          (conversation) =>
            conversation.conversationId === conversationId
              ? { ...conversation, lastMessage } // Update last message for matched conversation
              : conversation // Leave other conversations unchanged
        ),
      };
    }

    case "UPDATE_PENDING_CONTACT_REQUESTS": // Handle the new action
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          pendingCR: action.payload.pendingContactRequests,
        },
      };

    case "CANCEL_CONTACT_REQUEST":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          pendingCR: state.userInfo.pendingCR.filter(
            (u) => u !== action.payload.username
          ),
        },
      };

    case "ADD_CONTACT_REQUEST":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          // Append the new contact request to the array
          contactRequests: [
            ...state.userInfo.contactRequests,
            action.payload.newContactRequest,
          ],
        },
      };

    case "REMOVE_CONTACT_REQUEST":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          contactRequests: state.userInfo.contactRequests.filter(
            (contactRequest) =>
              contactRequest !== action.payload.contactRequestToRemove
          ),
        },
      };

    case "ADD_TO_CONTACT_LIST":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          contactList: [
            ...state.userInfo.contactList,
            action.payload.newContact,
          ],
        },
      };

    /////////
    default:
      return state; // Just return the state as it is without making changes
  }
};

export default loginReducer;
