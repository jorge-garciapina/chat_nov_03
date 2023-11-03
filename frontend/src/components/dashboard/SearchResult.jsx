import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useMutation } from "@apollo/client";
import {
  SEND_CONTACT_REQUEST,
  CANCEL_CONTACT_REQUEST,
} from "./../../graphql/userQueries";
import {
  cancelContactRequest,
  updatePendingContactRequests,
} from "./../../redux/actions";

const SearchResult = ({ user }) => {
  // Access the Redux state
  const pendingContactRequests = useSelector(
    (state) => state.userInfo.pendingCR
  );

  // Reading the contactList entry from the Redux state
  const contactList = useSelector((state) => state.userInfo.contactList);
  const dispatch = useDispatch();

  // Check if the user is in the pending contact requests array
  const isPendingRequest = pendingContactRequests.includes(user.username);

  // Check if the user is in the contact list array
  const isContact = contactList.includes(user.username);

  const handleSendMessageClick = () => {
    console.log(`Send message to: ${user.username}`); // Logging the username
  };

  // Initialize the send contact request mutation
  const [sendContactRequest, { loading: sending }] = useMutation(
    SEND_CONTACT_REQUEST,
    {
      onCompleted: (data) => {
        // Dispatch the action to update the Redux state with the new pending contact request
        dispatch(
          updatePendingContactRequests([
            ...pendingContactRequests,
            user.username,
          ])
        );
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  // Initialize the cancel contact request mutation
  const [cancelRequest, { loading: cancelling }] = useMutation(
    CANCEL_CONTACT_REQUEST,
    {
      onCompleted: (data) => {
        // Dispatch the action to update the Redux state by removing the username from pendingCR
        dispatch(cancelContactRequest(user.username));
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleAddFriendClick = () => {
    sendContactRequest({ variables: { receiverUsername: user.username } });
  };

  const handleCancelRequestClick = () => {
    cancelRequest({ variables: { receiverUsername: user.username } });
  };

  // Disable the button while the mutation is in progress
  const isButtonDisabled = sending || cancelling;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.avatar} alt={user.username} />
      </ListItemAvatar>
      <ListItemText primary={user.username} />
      {!isContact ? ( // Check if the user is not in the contact list
        !isPendingRequest ? (
          <Button onClick={handleAddFriendClick} disabled={isButtonDisabled}>
            {sending ? "Sending..." : "Add friend"}
          </Button>
        ) : (
          <Button
            onClick={handleCancelRequestClick}
            disabled={isButtonDisabled}
          >
            {cancelling ? "Cancelling..." : "Cancel Request"}
          </Button>
        )
      ) : (
        <Button onClick={handleSendMessageClick} disabled={isButtonDisabled}>
          Send Message
        </Button>
      )}
    </ListItem>
  );
};

export default SearchResult;
