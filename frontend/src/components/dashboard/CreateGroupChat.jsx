// Import required hooks and modules
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useMutation, useQuery } from "@apollo/client";

// Import GraphQL queries and mutations
import {
  CREATE_CONVERSATION,
  getDynamicConversationInfoQuery,
} from "./../../graphql/conversationClient";

const CreateGroupConversation = () => {
  // State variables for conversation name and members
  const [conversationName, setConversationName] = useState("");
  const [members, setMembers] = useState([""]);

  // Initialize Apollo Client's useMutation hook for conversation creation
  const [createConversation] = useMutation(CREATE_CONVERSATION);

  ////////////////////// START: DYNAMIC QUERY //////////////////////
  // Fields we are interested in for the conversation data
  const FIELDS = ["name", "participants"];

  // Use a utility function to create a dynamic query with the desired fields
  const DYNAMIC_CONVERSATION_INFO_QUERY =
    getDynamicConversationInfoQuery(FIELDS);

  // Initialize Apollo Client's useQuery hook to fetch the data based on dynamic query
  const {
    data: conversationData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(DYNAMIC_CONVERSATION_INFO_QUERY, {
    variables: { conversationId: "65320b1026060a6b1351e912" },
  });

  // useEffect to handle the fetched data (or error) once it arrives
  useEffect(() => {
    if (!queryLoading && !queryError && conversationData) {
      console.log(
        "name:",
        conversationData.getConversationInfo.name,
        "participants:",
        conversationData.getConversationInfo.participants
      );
    }
  }, [queryLoading, queryError, conversationData]);
  /////////////////////// END: DYNAMIC QUERY ///////////////////////

  // Function to handle changes to the conversation name input
  const handleConversationNameChange = (e) => {
    setConversationName(e.target.value);
  };

  // Function to handle changes to individual member inputs
  const handleMemberNameChange = (index, e) => {
    const newMembers = [...members];
    newMembers[index] = e.target.value;
    setMembers(newMembers);
  };

  // Function to add a new member input field
  const addMember = () => {
    setMembers([...members, ""]);
  };

  // Function to handle the actual conversation creation
  const handleCreate = async () => {
    try {
      const response = await createConversation({
        variables: {
          name: conversationName,
          participants: members,
          isGroupalChat: true,
        },
      });
      console.log("Mutation result:", response.data);
    } catch (err) {
      console.error("Error executing mutation:", err);
    }
  };

  return (
    <div>
      <h2>Create a new Group Conversation</h2>
      <label>
        Conversation name:
        <input
          type="text"
          value={conversationName}
          onChange={handleConversationNameChange}
        />
      </label>
      <br />
      <label>
        Conversation members:
        {members.map((member, index) => (
          <div key={index}>
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberNameChange(index, e)}
            />
          </div>
        ))}
      </label>
      <br />
      <Button variant="contained" color="secondary" onClick={addMember}>
        Add Member
      </Button>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Create
      </Button>
    </div>
  );
};

// Export the component for use in other parts of your application
export default CreateGroupConversation;
