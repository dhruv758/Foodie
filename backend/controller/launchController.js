const axios = require("axios");

const launchSwiggyScript = async (req, res) => {
  const { name, voteCount, url } = req.body;

  if (!name || !voteCount || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const urlParts = url.split("/");
  const restaurantSlug = urlParts[urlParts.length - 1];
  const restaurantName = restaurantSlug
    .split("-")
    .slice(0, -1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const dataToSend = {
    name,
    voteCount,
    url,
    restaurantName,
  };

  try {
    const ec2IP = "http://<YOUR-EC2-IP>:5000/trigger"; // Replace with actual IP
    const response = await axios.post(ec2IP, dataToSend);

    return res.status(200).json({
      message: "Swiggy script triggered via EC2",
      data: response.data,
    });
  } catch (error) {
    console.error("EC2 Trigger Failed:", error.message);
    return res.status(500).json({ error: "Failed to trigger script on EC2" });
  }
};

module.exports = { launchSwiggyScript };
