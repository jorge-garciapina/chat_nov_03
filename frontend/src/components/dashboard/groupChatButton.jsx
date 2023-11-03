import Button from "@mui/material/Button";
import React, { useState } from "react";
import CreateGroupConversation from "./CreateGroupChat";

const CreateGroupConversationButton = () => {
  const [showCreateComponent, setShowCreateComponent] = useState(false);

  // Function to toggle the CreateGroupConversation component visibility
  const handleCreateGroupConversation = () => {
    setShowCreateComponent(!showCreateComponent);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateGroupConversation}
      >
        Create Group Conversation
      </Button>
      {showCreateComponent && <CreateGroupConversation />}
    </div>
  );
};

export default CreateGroupConversationButton;
