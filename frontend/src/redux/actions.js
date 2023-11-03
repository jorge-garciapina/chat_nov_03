export const loginAction = (usernameFromInfo, username) => ({
  type: "LOGIN",
  payload: { usernameFromInfo, username },
});

export const logoutAction = (username) => ({
  type: "LOGOUT",
  payload: { username },
});

// Modify the updateUserInfo action creator to accept the receivedContactRequests array
export const updateUserInfo = (
  username,
  contactList,
  receivedContactRequests,
  conversations,
  pendingContactRequests
) => ({
  type: "UPDATE_USER_INFO",
  payload: {
    username,
    contactList,
    receivedContactRequests,
    conversations,
    pendingContactRequests,
  },
});

// Add a new action to update conversations
export const updateConversations = (conversations) => ({
  type: "UPDATE_CONVERSATIONS",
  payload: { conversations },
});

export const defineInterlocutors = (interlocutors) => ({
  type: "DEFINE_INTERLOCUTOR",
  payload: { interlocutors },
});

export const interlocutorIsOnline = (interlocutor) => ({
  type: "INTERLOCUTOR_IS_ONLINE",
  payload: { interlocutor },
});

export const addNewConversation = (newConversation) => ({
  type: "ADD_NEW_CONVERSATION",
  payload: { newConversation },
});

export const updateMessages = (messages) => ({
  type: "UPDATE_MESSAGES",
  payload: { messages },
});

export const appendMessage = (message) => ({
  type: "APPEND_MESSAGE",
  payload: { message },
});

export const setSelectedConversationId = (conversationId) => ({
  type: "SET_SELECTED_CONVERSATION_ID",
  payload: { conversationId },
});

export const updateLastMessage = (conversationId, lastMessage) => ({
  type: "UPDATE_LAST_MESSAGE",
  payload: { conversationId, lastMessage },
});

export const updatePendingContactRequests = (pendingContactRequests) => ({
  type: "UPDATE_PENDING_CONTACT_REQUESTS",
  payload: { pendingContactRequests },
});

export const cancelContactRequest = (username) => ({
  type: "CANCEL_CONTACT_REQUEST",
  payload: { username },
});

export const addContactRequest = (newContactRequest) => ({
  type: "ADD_CONTACT_REQUEST",
  payload: { newContactRequest },
});

export const removeContactRequest = (contactRequestToRemove) => ({
  type: "REMOVE_CONTACT_REQUEST",
  payload: { contactRequestToRemove },
});

export const addToContactList = (newContact) => ({
  type: "ADD_TO_CONTACT_LIST",
  payload: { newContact },
});
