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
    console.log(req.body);
    const result = await authService.registerRole(walletAddress, role);
    console.log(result);
    res.status(200).json({ token: result.token, role: result.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res
        .status(400)
        .json({ success: false, error: "Wallet address is required" });
    }

    const user = await authService.getUserByWallet(walletAddress);

    if (!user) {
      return res.json({ success: true, registered: false });
    }

    res.json({
      success: true,
      registered: true,
      role: user.role,
      preferences: user.preferences || {},
    });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
