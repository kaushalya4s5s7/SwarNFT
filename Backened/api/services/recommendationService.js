const axios = require("axios");

async function getMLRecommendations(userId) {
  try {
    const response = await axios.post("http://127.0.0.1:5001/recommend", {
      user_id: userId,
    });
    return response.data.recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

module.exports = { getMLRecommendations };
