// Import required packages
const { PubSub } = require("graphql-subscriptions");

// Initialize the PubSub instance for real-time updates
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30);

function changeUserStatus(username, contactList, status) {
  pubsub.publish("CHANGE_USER_STATUS", {
    changeUserStatus: { username, status, contactList },
  });

  return { username, status, contactList };
}

function notifyNewConversation(conversation) {
  pubsub.publish("NEW_CONVERSATION", {
    newConversation: conversation,
  });
}

function notifyNewMessage(messageInfo) {
  pubsub.publish("NOTIFY_NEW_MESSAGE", {
    newMessageNotification: messageInfo,
  });
}

function notifyContactRequest(validatedUser, receiverUsername) {
  pubsub.publish("NOTIFY_CONTACT_REQUEST", {
    contactRequestNotification: {
      sender: validatedUser,
      receiver: receiverUsername,
    },
  });
}

function notifyCancelRequest(validatedUser, receiverUsername) {
  pubsub.publish("NOTIFY_CANCEL_REQUEST", {
    cancelRequestNotification: {
      sender: validatedUser,
      receiver: receiverUsername,
    },
  });
}

// Export all necessary variables as a single object
module.exports = {
  pubsub,
  changeUserStatus,
  notifyNewConversation,
  notifyNewMessage,
  notifyContactRequest,
  notifyCancelRequest,
};
