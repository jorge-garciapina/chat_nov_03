// SendMessageItem.js
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { ADD_MESSAGE_TO_CONVERSATION } from "./../../graphql/conversationClient";

const SendMessageItem = () => {
  const [message, setMessage] = useState("");
  const conversationId = useSelector(
    (state) => state.conversation.conversationId
  ); // Extract conversationId from Redux state
  const [addMessageToConversation] = useMutation(ADD_MESSAGE_TO_CONVERSATION); // Apollo useMutation hook

  const handleSendMessage = async () => {
    if (message.trim() && conversationId) {
      try {
        // Execute the mutation with the necessary variables
        await addMessageToConversation({
          variables: {
            conversationId,
            content: message,
          },
        });
        setMessage(""); // Clear the input field after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
      <TextField
        variant="outlined"
        placeholder="Type a message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // Send message on enter key press
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSendMessage}
        disabled={!message.trim()} // Disable the button if the input is empty
      >
        Send
      </Button>
    </div>
  );
};

export default SendMessageItem;
