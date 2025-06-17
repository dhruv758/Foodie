

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const launchSwiggyScript = (req, res) => {
  const { name, voteCount, url } = req.body;

  // Validate input
  if (!name || !voteCount || !url) {
    return res.status(400).json({ error: "Missing required fields: name, voteCount, or url" });
  }

  // Extract restaurant name from URL (e.g., 'biryani-by-kilo-rest35270' -> 'Biryani By Kilo')
  const urlParts = url.split("/");
  const restaurantSlug = urlParts[urlParts.length - 1]; // Get 'biryani-by-kilo-rest35270'
  const restaurantName = restaurantSlug
    .split("-")
    .slice(0, -1) // Remove the 'rest35270' part
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join with spaces, e.g., 'Biryani By Kilo'


  const scriptDir = path.join(__dirname, "../../python-scripts");
  const scriptPath = path.join(scriptDir, "launch_swiggy.py");
  const tempDataPath = path.join(scriptDir, "temp_data.json");

  // Save data to JSON file
  const dataToWrite = {
    name,
    voteCount,
    url,
    restaurantName,
  };

  try {
    fs.writeFileSync(tempDataPath, JSON.stringify(dataToWrite));
  } catch (err) {
    console.error("Failed to write temp_data.json:", err);
    return res.status(500).json({ error: "Failed to prepare input data" });
  }

  // Execute Python script
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Execution error:", error.message);
      return res.status(500).json({ error: "Script execution failed", message: error.message });
    }
    if (stderr) {
      console.error("stderr:", stderr);
      return res.status(500).json({ error: "Script error", stderr });
    }

    console.log("stdout:", stdout);
    return res.status(200).json({
      message: "Swiggy script launched successfully",
      output: stdout,
    });
  });
};

module.exports = { launchSwiggyScript };