const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  musicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Music",
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  metadataURI: { type: String, required: true },
});

module.exports = mongoose.model("NFT", nftSchema);
