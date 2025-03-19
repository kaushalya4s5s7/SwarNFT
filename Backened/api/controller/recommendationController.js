const { getMLRecommendations } = require("../services/recommendationService");

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await getMLRecommendations(req.params.userId);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
};
