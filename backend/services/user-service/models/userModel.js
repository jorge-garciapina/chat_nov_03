const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // The email of the user; it is required and must be unique in the database.
  email: { type: String, required: true, unique: true },

  // The username of the user; it is required and must be unique in the database.
  username: { type: String, required: true, unique: true },

  // An array that stores the contact list of the user. Initialized as an empty array by default.
  contactList: { type: Array, default: [] },

  // An array of objects, each containing information about a received contact request.
  // It includes the sender's username, date of the request, and its status.
  receivedContactRequests: [
    {
      sender: { type: String, required: true },
      date: { type: Date, default: Date.now },
      status: { type: String, default: "pending" },
    },
  ],

  // An array of objects, each containing information about a rejected contact request.
  // It includes the receiver's username, date of the request, and a count of the rejections.
  rejectedContactRequests: [
    {
      receiver: { type: String, required: true },
      date: { type: Date, default: Date.now },
      rejectionCount: { type: Number, default: 0 },
    },
  ],

  // An array of objects, each containing information about a pending contact request sent by the user.
  // It includes the receiver's username and the date of the request.
  pendingContactRequests: [
    {
      receiver: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],

  conversations: {
    type: Object,
    default: {},
    // The 'of' keyword specifies the schema for the value of each key-value pair in the 'conversations' object.
    // It means that every conversation, identified by a unique key (which serves as the conversation ID),
    // will have an associated object that must conform to the given schema.
    // This associated object includes a 'name' (String), 'participants' (Array), and 'date' (Date).
    of: {
      name: { type: String, required: true },
      participants: { type: Array, required: true },
      isGroupalChat: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  },

  // The file name of the user's avatar image. Initialized to "defaultAvatar.png" by default.
  avatar: { type: String, default: "defaultAatar.png" },

  // A boolean value indicating whether the user is currently online. Initialized to true by default.
  online: { type: Boolean, required: true, default: true },
});

// Export the schema as a Mongoose model named 'User'.
module.exports = mongoose.model("User", UserSchema);
