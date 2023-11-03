const mongoose = require("mongoose");

// Define schema for individual messages
const MessageSchema = new mongoose.Schema({
  // Sender of the message
  sender: { type: String, required: true },

  // Content of the message
  content: { type: String, required: true },

  // Array of receivers
  receivers: { type: [String], required: true },

  // Array to store who the message was delivered to
  deliveredTo: { type: [String], default: [] },

  // Array to store who has seen the message
  seenBy: { type: [String], default: [] },

  // Index of the message within the conversation
  index: { type: Number, required: true },

  // Indicate if the message is visible or not
  isVisible: { type: Boolean, default: true },
});

// Define schema for conversations
const ConversationSchema = new mongoose.Schema({
  // Conversation name
  name: { type: String, required: true },

  // Array of participants' usernames in the conversation
  participants: { type: [String], required: true },

  // NEW FIELD: Array of admin usernames in the conversation
  admins: { type: [String], default: [] }, // Defaulting it to an empty array

  // Indicates if this is a group chat or not
  isGroupalChat: { type: Boolean, default: false },

  // The date the conversation was created
  date: { type: Date, default: Date.now },

  // Array of messages within the conversation
  messages: [MessageSchema],
});

// Export the schema as a Mongoose model named 'Conversation'.
module.exports = mongoose.model("Conversation", ConversationSchema);
