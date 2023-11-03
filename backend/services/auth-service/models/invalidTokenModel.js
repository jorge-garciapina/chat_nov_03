const mongoose = require("mongoose");

const InvalidTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("InvalidToken", InvalidTokenSchema);
