// Importing the necessary modules and environmental variables
const express = require("express");
const Conversation = require("../models/conversationModel"); // Import the Conversation model

// Creating a new Express Router instance
const router = express.Router();
// Endpoint to create a new conversation
router.post("/createConversation", async (req, res) => {
  try {
    // Step 1: Extract the required fields from the request body
    const { participants, name, isGroupalChat, validatedUser } = req.body;

    // Step 2: Validate the request. For example, it should have at least two participants.
    if (!participants || participants.length < 2) {
      return res.status(400).json({ error: "Invalid participants" });
    }

    // Step 3: Initialize the admins array with the validatedUser
    const admins = [validatedUser];

    // Step 4: Create a new Conversation document with admins field
    const newConversation = new Conversation({
      participants,
      name,
      isGroupalChat,
      messages: [],
      admins, // Newly added admins field
    });

    // Step 5: Save the new Conversation to the database
    await newConversation.save();

    // Step 6: Respond with a success message and the ID of the new conversation
    res.status(201).json({
      message: "New conversation created",
      conversationId: newConversation._id,
    });
  } catch (error) {
    // Log the full error if something goes wrong
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.post("/addMessageToConversation", async (req, res) => {
  try {
    // Extract all the necessary fields from the request body
    // Removed 'sender', added 'validatedUser'
    const { conversationId, content, validatedUser } = req.body;

    // Validate the request body
    // Removed the 'sender' validation
    if (!conversationId || !validatedUser || !content) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Find the existing conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Extract the participants field from the conversation and filter out the validatedUser
    // Using filter() to create a new array containing all elements except the validatedUser
    const receivers = conversation.participants.filter(
      (participant) => participant !== validatedUser
    );

    // Determine the index for the new message
    const newIndex = conversation.messages.length;

    // Create the new message object
    // Replaced 'sender' with 'validatedUser'
    const newMessage = {
      sender: validatedUser, // Using validatedUser as the sender
      receivers,
      content,
      index: newIndex,
      deliveredTo: [],
      seenBy: [],
      isVisible: true,
    };

    // Add the new message to the conversation
    conversation.messages.push(newMessage);

    // Save the updated conversation
    await conversation.save();

    // Respond with a success message
    res.status(201).json({
      message: "Message successfully added",
      newMessage,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Route to get 'deliveredTo' array for a specific message in a conversation
router.get(
  "/getDeliveredTo/:conversationId/:messageIndex",
  async (req, res) => {
    try {
      // Parse the conversation ID and message index from the request parameters
      const { conversationId, messageIndex } = req.params;

      // Convert messageIndex to a Number
      const msgIndex = Number(messageIndex);

      // Fetch the conversation from MongoDB using its ID
      const conversation = await Conversation.findById(conversationId);

      // Check if the conversation exists
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Find the message by its index
      const message = conversation.messages.find(
        (msg) => msg.index === msgIndex
      );

      // Check if the message exists
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Respond with the 'deliveredTo' array of the message
      res.status(200).json({ deliveredTo: message.deliveredTo });
    } catch (error) {
      // Log the error and respond with a 500 status code
      console.error("Server Error:", error);
      res.status(500).json({ error: "Server error: " + error.message });
    }
  }
);

// Route to get 'seenBy' array for a specific message in a conversation
router.get("/getSeenBy/:conversationId/:messageIndex", async (req, res) => {
  try {
    // Parse the conversation ID and message index from the request parameters
    const { conversationId, messageIndex } = req.params;

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Fetch the conversation from MongoDB using its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Find the message by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    // Check if the message exists
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Respond with the 'seenBy' array of the message
    res.status(200).json({ seenBy: message.seenBy });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Route to add a username to 'deliveredTo' for a specific message in a conversation
router.post("/addNameTodeliveredTo", async (req, res) => {
  try {
    // Extract data from request body
    const { conversationId, messageIndex, username } = req.body;

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if conversation and message exist
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Find the message within the conversation by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add the username to the 'deliveredTo' array
    message.deliveredTo.push(username);

    // Save the updated conversation
    await conversation.save();

    res.status(200).json({ message: "Username added to deliveredTo" });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Route to add a username to 'seenBy' for a specific message in a conversation
router.post("/addNameToseenBy", async (req, res) => {
  try {
    // Extract data from request body
    const { conversationId, messageIndex, username } = req.body;

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if conversation and message exist
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Find the message within the conversation by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add the username to the 'seenBy' array
    message.seenBy.push(username);

    // Save the updated conversation
    await conversation.save();

    res.status(200).json({ message: "Username added to seenBy" });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// New route to notify that messages have been delivered to a user across multiple conversations
router.post("/notifyMessageIsDelivered", async (req, res) => {
  try {
    // Step 1: Extract conversation IDs and username from the request body
    const { conversationIds, username } = req.body;

    // Step 2: Validate the request body
    if (!Array.isArray(conversationIds) || !username) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Step 3: Iterate over each conversation ID
    for (let id of conversationIds) {
      const conversation = await Conversation.findById(id);

      // Check if the conversation exists
      if (conversation) {
        // Step 4: Iterate over messages in reverse (starting from the latest)
        for (let i = conversation.messages.length - 1; i >= 0; i--) {
          const message = conversation.messages[i];

          // Step 5: Check if the username is already in 'deliveredTo'
          if (message.deliveredTo.includes(username)) {
            // If found, break the loop to stop further checking for this conversation
            break;
          } else {
            // Step 6: Add the username to 'deliveredTo' for this message
            message.deliveredTo.push(username);

            // Update the database
            await conversation.save();
          }
        }
      }
    }

    // Step 7: Send a response indicating the operation was successful
    res
      .status(200)
      .json({ message: "Updated deliveredTo for multiple conversations" });
  } catch (error) {
    console.error("Server Error:", error); // Log the full error
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.get("/getConversationInfo/:conversationId", async (req, res) => {
  try {
    // Extract the conversation ID from the request parameters
    const { conversationId } = req.params;

    // Fetch the conversation from MongoDB using its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Extract the relevant fields
    const { name, participants, isGroupalChat, messages } = conversation;

    // Respond with the required conversation information
    res.status(200).json({
      name,
      participants,
      isGroupalChat,
      messages,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.get("/getLastMessage/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const lastMessage = conversation.messages.pop(); // Gets the last message

    res.status(200).json({ lastMessage });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.post("/deleteMessage", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and message index from the request body
    const { conversationId, messageIndex } = req.body;

    // Step 2: Validate the request body
    if (!conversationId || !messageIndex) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Step 5: Check if the message exists
    const message = conversation.messages[messageIndex];
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Step 6: Update the isVisible field of the message to false
    message.isVisible = false;

    // Step 7: Save the updated conversation to the database
    await conversation.save();

    // Step 8: Send a response indicating the operation was successful
    res.status(200).json({ message: "Message visibility set to false" });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Route to modify the name of a conversation
router.post("/modifyConversationName", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and the new name from the request body
    const { conversationId, newName } = req.body;

    // Step 2: Validate the request body
    if (!conversationId || !newName) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Step 5: Update the name field of the conversation
    conversation.name = newName;

    // Step 6: Save the updated conversation to the database
    await conversation.save();

    // Step 7: Send a response indicating the operation was successful
    res.status(200).json({
      message: "Conversation name updated successfully",
      participants: conversation.participants,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.post("/addChatMember", async (req, res) => {
  try {
    // Extract required fields from the request body
    const { conversationId, nameToAdd } = req.body;

    // Validate the request parameters
    if (!conversationId || !nameToAdd) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Retrieve the conversation from the database
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if 'nameToAdd' is already a participant
    if (conversation.participants.includes(nameToAdd)) {
      return res.status(200).json({
        message: `${nameToAdd} is already a participant in the conversation`,
      });
    }

    // Add the new member to the 'participants' array
    conversation.participants.push(nameToAdd);

    // Save the updated conversation to the database
    await conversation.save();

    // Destructure 'conversation' object to exclude the 'messages' field
    const { messages, ...conversationWithoutMessages } =
      conversation.toObject();

    // Respond with a success message
    res.status(200).json({
      message: `${nameToAdd} added to the conversation`,
      conversation: conversationWithoutMessages,
    });
  } catch (error) {
    // Log the error and respond with a server error message
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});
// Route to remove a member from a conversation
router.post("/removeChatMember", async (req, res) => {
  try {
    // Step 1: Extract conversationId and nameToRemove from the request body
    const { conversationId, nameToRemove } = req.body;

    // Step 2: Validate the request parameters
    if (!conversationId || !nameToRemove) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Step 3: Retrieve the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Step 5: Find and remove the member from the participants array
    const index = conversation.participants.indexOf(nameToRemove);
    if (index > -1) {
      conversation.participants.splice(index, 1);
    } else {
      return res
        .status(404)
        .json({ error: "Member name not found in conversation" });
    }

    // Step 6: Save the updated conversation object
    await conversation.save();

    // Step 7: Return the success message and updated participants array
    res.status(200).json({
      message: "Member removed from the conversation",
      participants: conversation.participants, // Include the updated participants array
    });
  } catch (error) {
    // Handle errors and log them
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

router.post("/addAdmin", async (req, res) => {
  try {
    // Step 1: Extract required fields from the request body
    const { conversationId, validatedUser, newAdmins } = req.body; // Changed newAdmin to newAdmins

    // Step 2: Validate the request parameters
    if (
      !conversationId ||
      !validatedUser ||
      !newAdmins ||
      !Array.isArray(newAdmins)
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Step 3: Retrieve the conversation from the database
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Step 5: Validate if the 'validatedUser' is an admin
    if (!conversation.admins.includes(validatedUser)) {
      return res
        .status(403)
        .json({ error: "No permission for this operation" });
    }

    // Step 6: Validate if 'newAdmins' are participants in the conversation
    const invalidAdmins = newAdmins.filter(
      (admin) => !conversation.participants.includes(admin)
    );

    if (invalidAdmins.length > 0) {
      return res.status(403).json({
        error: "All new admins must be participants in the conversation",
      });
    }

    // Step 7: Add the new admins to the 'admins' array
    conversation.admins.push(...newAdmins);

    // Step 8: Save the updated conversation to the database
    await conversation.save();

    // Step 9: Respond with a success message
    res.status(200).json({
      message: "New admins added successfully",
      admins: conversation.admins,
    });
  } catch (error) {
    // Step 10: Log the error and respond with a server error message
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
