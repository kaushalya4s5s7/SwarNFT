const Music = require("../../models/Music");

exports.uploadMusic = async (artistId, title, genre, file, metadata) => {
  const newMusic = new Music({ artistId, title, genre, file, metadata });
  await newMusic.save();
  return { musicId: newMusic._id };
};

exports.getMusicDetails = async (musicId) => {
  const music = await Music.findById(musicId).select("-__v");
  if (!music) throw new Error("Music not found");
  return music;
};
