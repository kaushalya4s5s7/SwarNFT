const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  role: { type: String, enum: ["listener", "artist"], required: true },
  preferences: { type: Object, default: {} },
});

module.exports = mongoose.model("User", userSchema);
