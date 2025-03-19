const musicService = require("../services/musicService");

exports.uploadMusic = async (req, res) => {
  try {
    const { artistId, title, genre, file, metadata } = req.body;
    const result = await musicService.uploadMusic(
      artistId,
      title,
      genre,
      file,
      metadata
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMusicDetails = async (req, res) => {
  try {
    const { musicId } = req.params;
    const music = await musicService.getMusicDetails(musicId);
    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
