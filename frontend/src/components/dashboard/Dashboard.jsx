import * as React from "react";
import { useSubscription, useQuery, useMutation } from "@apollo/client";
// REDUX LOGIC
import { useDispatch } from "react-redux";
import {
  loginAction,
  logoutAction,
  updateUserInfo,
  addNewConversation,
  addContactRequest,
  removeContactRequest,
} from "./../../redux/actions";

// GRAPHQL LOGIC
import {
  LOGOUT_USER_MUTATION,
  STATUS_BASED_ON_VIEW,
} from "../../graphql/authQueries";
import { INFO_QUERY } from "../../graphql/userQueries";
import {
  CHANGE_USER_STATUS,
  NEW_CONVERSATION,
  CONTACT_REQUEST_NOTIFICATION,
  CANCEL_REQUEST_NOTIFICATION,
} from "../../graphql/subscriptionClient";

// OTHER REACT COMPONENTS
import GeneralNotifications from "./GeneralNotifications";
import Contacts from "./Contacts";
import Conversation from "./ConversationComponent";
import CreateGroupConversationButton from "./groupChatButton";
import Conversations from "./Conversations";
import SearchComponent from "./SearchComponent";

import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Updating status based on location
  const [updateStatusBasedOnView] = useMutation(STATUS_BASED_ON_VIEW);
  const userToken = localStorage.getItem("authToken");

  React.useEffect(() => {
    updateStatusBasedOnView({
      variables: { token: userToken, location: location.pathname },
    });
  }, [location.pathname, userToken, updateStatusBasedOnView]);

  // Fetching user information
  const { data: infoData, error: infoError } = useQuery(INFO_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const username = data?.userInfo?.username;
      const contactList = data?.userInfo?.contactList;
      const conversations = data?.userInfo?.conversations || [];

      // Using the map function to transform the array of objects into an array of strings
      const receivedContactRequests = data.userInfo.receivedContactRequests.map(
        (request) => request.sender
      );

      const pendingContactRequests = data.userInfo.pendingContactRequests.map(
        (request) => request.receiver
      );

      dispatch(
        updateUserInfo(
          username,
          contactList,
          receivedContactRequests,
          conversations,
          pendingContactRequests
        )
      );
    },
  });

  // Extracting username from userInfo
  const usernameFromInfo = infoData?.userInfo?.username;

  // Logout mutation
  const [logoutUser] = useMutation(LOGOUT_USER_MUTATION, {
    onCompleted(data) {},
  });

  // Logout before page unload
  React.useEffect(() => {
    const logoutBeforeUnload = () => {
      logoutUser({ variables: { token: userToken } });
    };
    window.addEventListener("beforeunload", logoutBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", logoutBeforeUnload);
    };
  }, [userToken, logoutUser]);

  // NEW_CONVERSATION subscription
  useSubscription(NEW_CONVERSATION, {
    variables: { username: usernameFromInfo },
    onSubscriptionData: ({ subscriptionData }) => {
      const newConversation = subscriptionData.data.newConversation;
      dispatch(addNewConversation(newConversation));
    },
  });

  // CHANGE_USER_STATUS subscription
  const { data: subscriptionData, error: subscriptionError } = useSubscription(
    CHANGE_USER_STATUS,
    {
      variables: { username: usernameFromInfo },
      onSubscriptionData: ({ subscriptionData }) => {
        const { username, status } = subscriptionData.data.changeUserStatus;
        if (status === "ONLINE") {
          dispatch(loginAction(usernameFromInfo, username));
        } else if (status === "OFFLINE") {
          dispatch(logoutAction(username));
        }
      },
    }
  );

  // CONTACT_REQUEST_NOTIFICATION subscription
  useSubscription(CONTACT_REQUEST_NOTIFICATION, {
    variables: { username: usernameFromInfo },
    onSubscriptionData: ({ subscriptionData }) => {
      const contactRequest = subscriptionData.data.contactRequestNotification;

      // Dispatch the action instead of logging to the console
      dispatch(addContactRequest(contactRequest.sender));
    },
  });

  // CANCEL_REQUEST_NOTIFICATION subscription
  useSubscription(CANCEL_REQUEST_NOTIFICATION, {
    variables: { username: usernameFromInfo },
    onSubscriptionData: ({ subscriptionData }) => {
      const cancelRequest = subscriptionData.data.cancelRequestNotification;
      dispatch(removeContactRequest(cancelRequest.sender));
    },
  });

  // Error Handling
  if (infoError) {
    return <p>Error in fetching user info: {infoError.message}</p>;
  }
  if (subscriptionError) {
    return <p>Error in subscription: {subscriptionError.message}</p>;
  }

  const { username: friendUsername, status } =
    subscriptionData?.changeUserStatus || {};

  return (
    <div>
      <button onClick={() => logoutUser({ variables: { token: userToken } })}>
        Logout
      </button>
      <CreateGroupConversationButton />
      <h1>{usernameFromInfo}</h1>
      <SearchComponent />
      <GeneralNotifications />
      <h1>User Status:</h1>
      {friendUsername ? (
        <p>
          {friendUsername}'s status is now: {status}
        </p>
      ) : (
        <p>Waiting for status update...</p>
      )}
      <Contacts />
      <Conversation />
      <Conversations />
    </div>
  );
}
