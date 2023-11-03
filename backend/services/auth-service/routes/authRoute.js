// Importing the necessary modules and environmental variables
const express = require("express");
const User = require("../models/authModel");
const InvalidToken = require("../models/invalidTokenModel");
const jwt = require("jsonwebtoken");

const {
  registerInputValidation,
  loginInputValidation,
  changePasswordValidation,
} = require("../validation/backendValidation");

// Creating a new Express Router instance
const router = express.Router();

router.get("/information", async (req, res) => {
  res.status(200).json({
    message: "Connection test passed",
  });
});

///////////////////////////////
router.post("/register", registerInputValidation, async (req, res) => {
  // Extract email, username, password, and avatar from the request body
  const { email, username, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser_email = await User.findOne({ email });

    if (existingUser_email) {
      return res.status(200).json({ error: "Email already exists" });
    }

    // Check if a user with the same username already exists
    const existingUser_username = await User.findOne({ username });
    if (existingUser_username) {
      return res.status(200).json({ error: "Username already exists" });
    }

    // Create a new user instance
    const user = new User({ email, username, password });

    // Generate token for the user
    await user.generateToken();

    // Save the user with the generated token
    await user.save();

    res.status(200).json({
      message: "Registration successful",
      token: user.token,
    });
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

//////////////////////////////////////
router.post("/login", loginInputValidation, async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "Invalid username or password" });
    }
    user.verifyPassword(password, async (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(200).json({ error: "Invalid username or password" });
      }
      const token = await user.generateToken();

      res.status(200).json({ token: token });
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
////////////////////////////////////////////
// Route to change a user's password
router.post("/change-password", changePasswordValidation, async (req, res) => {
  try {
    // Extract the token, old password, and new password from the request body
    const { token, oldPassword, newPassword } = req.body;

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    if (!decoded) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const username = decoded["username"];

    // Find the user with the ID extracted from the token
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    // Verify the old password
    user.verifyPassword(oldPassword, async (err, isMatch) => {
      if (err || !isMatch) {
        return res
          .status(200)
          .json({ error: "Current password does not match" });
      }

      // Change the password
      user.password = newPassword;
      await user.save();

      // Respond with a success message
      res.status(200).json({ message: "Password change successful" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

///////////////////////////////////////////////
// Route to invalidate a session
router.post("/logout", async (req, res) => {
  try {
    // Extract the token from the request body
    const { token } = req.body;

    let decoded;
    try {
      // Decode the token to get the user id
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }
    if (!decoded) {
      return res.status(200).json({ error: "Invalid token" });
    }

    console.log(decoded);
    const username = decoded["username"];
    // Find the user with the ID extracted from the token
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    // Invalidate the user's token
    const invalidToken = new InvalidToken({ token: token });
    await invalidToken.save();
    // Respond with a success message
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});
///////////////////////////////////////////////

// Endpoint to validate user operations
router.get("/validateUserOperation", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(200).json({ error: "Invalid or expired token" });
    }

    const senderUsername = decoded.username;
    const sender = await User.findOne({ username: senderUsername });

    if (!sender) {
      return res.status(200).json({ error: "Sender not found" });
    }

    const validatedUser = senderUsername;

    // Respond with a success message and the decoded token

    res.json({ success: true, validatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

// Endpoint to validate user operations
router.get("/validateMessageReciever/:receiver", async (req, res) => {
  try {
    const validatedUser = req.params.receiver;
    const receiver = await User.findOne({ username: validatedUser });

    if (!receiver) {
      return res.status(200).json({ error: "Receiver not found" });
    }
    res.json({ success: true, validatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

module.exports = router;
