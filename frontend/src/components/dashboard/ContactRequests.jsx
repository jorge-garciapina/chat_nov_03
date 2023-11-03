// @MUI components
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

// REDUX logic
import { useDispatch } from "react-redux";
import { removeContactRequest, addToContactList } from "./../../redux/actions";

// GRAPHQL related logic:
import { useMutation } from "@apollo/client";
import {
  ACCEPT_CONTACT_REQUEST_MUTATION,
  REJECT_CONTACT_REQUEST_MUTATION,
} from "./../../graphql/userQueries";

const ContactRequests = ({ requests }) => {
  const dispatch = useDispatch();
  const [acceptContactRequestMutation] = useMutation(
    ACCEPT_CONTACT_REQUEST_MUTATION
  );
  const [rejectContactRequestMutation] = useMutation(
    REJECT_CONTACT_REQUEST_MUTATION
  );

  // Function to handle accept request
  const handleAcceptRequest = (username) => {
    acceptContactRequestMutation({ variables: { senderUsername: username } })
      .then((response) => {
        console.log("ACCEPTED", response);
        dispatch(removeContactRequest(username));
        dispatch(addToContactList(username));
      })
      .catch((error) => {
        console.error("Error accepting contact request:", error);
      });
  };

  // Function to handle reject request
  const handleRejectRequest = (username) => {
    rejectContactRequestMutation({ variables: { senderUsername: username } })
      .then((response) => {
        console.log("REJECTED", response);
        dispatch(removeContactRequest(username));
      })
      .catch((error) => {
        console.error("Error rejecting contact request:", error);
      });
  };

  return (
    <List component="nav">
      {requests && requests.length > 0 ? (
        requests.map((contact, index) => (
          <ListItem key={index}>
            <ListItemText primary={contact} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAcceptRequest(contact)}
            >
              Accept Request
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRejectRequest(contact)}
            >
              Reject Request
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No contact requests available" />
        </ListItem>
      )}
    </List>
  );
};

export default ContactRequests;
