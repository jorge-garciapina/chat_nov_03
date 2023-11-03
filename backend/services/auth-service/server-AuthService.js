// Importing necessary modules, environmental variables, and routes
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");

// Initializing our Express app
const app = express();

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.AUTH_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

// // Enabling JSON parsing in Express
app.use(express.json());

// Adding our auth routes to the Express app
app.use("/auth", authRoutes);

// ...
const port = 3001;
app.listen(port, () => console.log(`Auth service running on port ${port}`));
