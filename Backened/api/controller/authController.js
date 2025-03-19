const authService = require("../services/authService");

exports.connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const result = await authService.connectWallet(walletAddress);
    if (result.exists) {
      return res.status(200).json({ token: result.token, role: result.role });
    }
    return res.status(200).json({ message: "Role selection required" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerRole = async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    const result = await authService.registerRole(walletAddress, role);
    res.status(200).json({ token: result.token, role: result.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
