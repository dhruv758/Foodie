const axios = require("axios");

const launchSwiggyScript = async (req, res) => {
  const { name, voteCount, url } = req.body;
  if (!name || !voteCount || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Prepare payload
  const restaurantName = url
    .split("/")
    .pop()
    .split("-")
    .slice(0, -1)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const dataToSend = { name, voteCount, url, restaurantName };

  try {
    console.log("➡ Sending to EC2:", dataToSend);
    const response = await axios.post(
      "http://13.204.80.58:5000/trigger",
      dataToSend
    );
    console.log("✅ EC2 responded with:", response.data);
    return res.status(200).json({
      message: "Swiggy script triggered via EC2",
      data: response.data
    });
  } catch (error) {
    console.error("💥 EC2 Trigger Failed:", error.message);

    if (error.response) {
      // Response from server but status code >= 400
      console.error("🛠 EC2 Error data:", error.response.data);
      console.error("🔢 EC2 Status code:", error.response.status);
      return res
        .status(error.response.status)
        .json({ error: "EC2 responded with error", detail: error.response.data });
    } else if (error.request) {
      // No response received (network/server down)
      console.error("📡 No response received:", error.request);
      return res.status(502).json({ error: "No response from EC2" });
    } else {
      // Other setup/config errors
      console.error("❓ Axios setup error:", error);
      return res.status(500).json({ error: "Axios setup failed" });
    }
  }
};

module.exports = { launchSwiggyScript };
