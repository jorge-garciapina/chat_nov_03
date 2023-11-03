const { withFilter } = require("graphql-subscriptions");

const { pubsub } = require("./pubsub_logic");

const resolvers = {
  Subscription: {
    // changeUserToOnline AND changeUserToOffline ARE NOT IMPORTANT, ONLY PAY ATTENTION TO changeUserStatus
    changeUserStatus: {
      // The `subscribe` function is called when a client initiates a subscription
      // The `withFilter` function adds a layer of filtering to ensure only relevant updates are sent
      // It checks whether the username in the payload matches the username provided by the client
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHANGE_USER_STATUS"]),
        (payload, variables) => {
          const contactListOfLoggedUser = payload.changeUserStatus.contactList;

          const userInSubscription = variables.username;

          return contactListOfLoggedUser.indexOf(userInSubscription) !== -1;
        }
      ),

      // The `resolve` function constructs the payload that is sent to the client
      // Here, it simply forwards the data that was published to the FRIEND_STATUS_CHANGED event
      resolve: (payload) => {
        return payload.changeUserStatus;
      },
    },

    newConversation: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_CONVERSATION"]),
        (payload, variables) => {
          return payload.newConversation.participants.includes(
            variables.username
          );
        }
      ),
      resolve: (payload) => {
        return payload.newConversation;
      },
    },

    notifyNewMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_NEW_MESSAGE"]),
        (payload, variables) => {
          return payload.newMessageNotification.usersToUpdate.includes(
            variables.username
          );
        }
      ),
      resolve: (payload) => {
        return payload.newMessageNotification;
      },
    },

    contactRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_CONTACT_REQUEST"]),
        (payload, variables) => {
          // Only notify the user who received the contact request
          return (
            payload.contactRequestNotification.receiver === variables.username
          );
        }
      ),
      resolve: (payload) => {
        return payload.contactRequestNotification;
      },
    },

    cancelRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_CANCEL_REQUEST"]),
        (payload, variables) => {
          return (
            payload.cancelRequestNotification.receiver === variables.username
          );
        }
      ),
      resolve: (payload) => {
        return payload.cancelRequestNotification;
      },
    },
  },
};

// Export resolvers for use in the GraphQL server
module.exports = resolvers;
