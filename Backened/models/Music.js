const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  file: { type: String, required: true },
  metadata: { type: Object, default: {} },
});

module.exports = mongoose.model("Music", musicSchema);
