// Importing the mongoose module to handle MongoDB data
const mongoose = require("mongoose");
// Importing the bcrypt module for password hashing
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Creating a new mongoose schema for users.
const UserSchema = new mongoose.Schema({
  // 'email' field will store the user's password. This field is unique and required.
  email: { type: String, required: true, unique: true },

  // 'username' field will store the user's username. This field is unique and required.
  username: { type: String, required: true, unique: true },

  // 'password' field will store the user's password. This field is required.
  password: { type: String, required: true },
});

// Hash the password before saving it
UserSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (user.isModified("password")) {
    // Generate a hash for the password
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
      // Replace the plain-text password with the hash
      user.password = hash;
      next();
    });
  } else {
    // Generate a new token if it's a new user or token is empty
    if (!user.token) {
      user.generateToken();
    }
    next();
  }
});

// Method to change password
UserSchema.methods.changePassword = async function (oldPassword, newPassword) {
  // Check if the old password matches the current password
  const isMatch = await this.verifyPassword(oldPassword);
  if (!isMatch) {
    throw new Error("Current password does not match");
  }

  // Set the new password
  this.password = newPassword;

  // Save the user document
  await this.save();
};

// Method to verify password
UserSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Method to generate and assign a new token
UserSchema.methods.generateToken = async function () {
  const token = jwt.sign({ username: this.username }, process.env.JWT_SECRET, {
    /////////////////////////////
    expiresIn: "10h",
  });

  // Assign the token to the user
  this.token = token;

  // Return the token
  return token;
};

// Exporting the User model.
module.exports = mongoose.model("User", UserSchema);
