const nftService = require("../services/nftService");

exports.mintNFT = async (req, res) => {
  try {
    const { musicId, artistId, metadataURI } = req.body;
    const result = await nftService.mintNFT(musicId, artistId, metadataURI);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNFTsByOwner = async (req, res) => {
  try {
    const { userId } = req.params;
    const nfts = await nftService.getNFTsByOwner(userId);
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
