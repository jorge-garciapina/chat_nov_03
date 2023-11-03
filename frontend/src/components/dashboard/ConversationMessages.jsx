import React from "react";
import { List, ListItem } from "@mui/material";
import { styled } from "@mui/system";

const StyledList = styled(List)`
  max-height: 300px;
  overflow-y: auto;
`;

const ConversationMessages = ({ messages }) => {
  return (
    <StyledList>
      {messages.map((message, index) => (
        <ListItem key={index}>
          {/* Displaying sender and content of each message */}
          <strong>{message.sender}:</strong> {message.content}
        </ListItem>
      ))}
    </StyledList>
  );
};

export default ConversationMessages;
