import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch } from "react-redux";
import { defineInterlocutors } from "./../../redux/actions";

const ContactList = ({ contacts }) => {
  const dispatch = useDispatch();

  // Function to handle list item click
  const handleListItemClick = (username) => {
    dispatch(defineInterlocutors([username]));
  };

  return (
    <List component="nav">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleListItemClick(contact)}
          >
            <ListItemText primary={contact} />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No contacts available" />
        </ListItem>
      )}
    </List>
  );
};

export default ContactList;
