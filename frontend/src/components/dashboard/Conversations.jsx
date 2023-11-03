import React, { useEffect } from "react";
// @MUI COMPONENTS
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// REDUX LOGIC:
import { useSelector, useDispatch } from "react-redux";
import {
  defineInterlocutors,
  updateMessages,
  appendMessage,
  updateLastMessage,
  setSelectedConversationId,
} from "./../../redux/actions";

// GRAPHQL LOGIC:
import { useLazyQuery, useSubscription } from "@apollo/client";
import { getDynamicConversationInfoQuery } from "./../../graphql/conversationClient";
import { NOTIFY_NEW_MESSAGE } from "./../../graphql/subscriptionClient";

const Conversations = () => {
  const username = useSelector((state) => state.userInfo.username);
  const { conversationId: currentConversationId } = useSelector(
    (state) => state.conversation
  );
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();

  // NOTIFY_NEW_MESSAGE subscription
  useSubscription(NOTIFY_NEW_MESSAGE, {
    variables: { username },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data && subscriptionData.data.notifyNewMessage) {
        const {
          conversationId,
          content,
          deliveredTo,
          receivers,
          index,
          seenBy,
          sender,
          isVisible,
        } = subscriptionData.data.notifyNewMessage.newMessage;

        // Check if the conversationId received in the subscription equals the conversationId in the Redux state
        if (currentConversationId && conversationId === currentConversationId) {
          // Dispatch the appendMessage action to update the conversation
          dispatch(
            appendMessage({
              __typename: "Message",
              content,
              deliveredTo,
              receivers,
              index,
              seenBy,
              sender,
              isVisible,
            })
          );
        }
        // Prepare the lastMessage object based on the new message data
        const lastMessage = {
          __typename: "LastMessage",
          content,
          sender,
        };

        // Dispatch the action to update the last message of the conversation
        dispatch(updateLastMessage(conversationId, lastMessage));
      }
    },
  });

  // Prepare a dynamic GraphQL query to get conversation participants and messages
  const getParticipantsAndMessagesQuery = getDynamicConversationInfoQuery([
    "participants",
    "messages {content deliveredTo receivers index seenBy sender isVisible}",
  ]);

  // Execute the query lazily when a conversation is clicked
  const [getConversationInfo, { data, error }] = useLazyQuery(
    getParticipantsAndMessagesQuery
  );

  const handleClick = (conversation) => {
    // Fetch the selected conversation's details
    getConversationInfo({
      variables: { conversationId: conversation.conversationId },
    });

    // Dispatch the action to update the selected conversation ID in the Redux state
    dispatch(setSelectedConversationId(conversation.conversationId));
  };

  // Handle the data received from the GraphQL query
  useEffect(() => {
    if (data) {
      const { participants, messages } = data.getConversationInfo;
      // Filter out the current user from the participants
      const filteredParticipants = participants.filter(
        (participant) => participant !== username
      );

      // Update the Redux state with the participants and messages
      dispatch(defineInterlocutors(filteredParticipants));
      dispatch(updateMessages(messages));
    }
    if (error) {
      // Log errors if any occur while fetching conversation info
      console.error("Error fetching conversation info:", error);
    }
  }, [data, error, dispatch, username]);

  return (
    <div>
      <h1>Conversations</h1>
      <List>
        {conversations.map((conversation, index) => (
          <ListItem
            key={index}
            button
            onClick={() => handleClick(conversation)}
          >
            {/* Display the conversation name */}
            <ListItemText
              primary={conversation.name}
              secondary={
                // Display the last message content if available, otherwise indicate "No messages yet"
                conversation.lastMessage
                  ? conversation.lastMessage.content
                  : "No messages yet"
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Conversations;
