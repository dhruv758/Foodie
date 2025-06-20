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

  // Use the mounted path inside the Docker container
  const scriptDir = "/app/SWIGGY";
  const tempDataPath = path.join(scriptDir, "temp_data.json");

  console.log("Debug info:");
  console.log("- scriptDir:", scriptDir);
  console.log("- tempDataPath:", tempDataPath);
  console.log("- Current working directory:", process.cwd());
  console.log("- SWIGGY directory exists:", fs.existsSync(scriptDir));

  // Save data to JSON file
  const dataToWrite = {
    name,
    voteCount,
    restaurantName,
  };

  console.log("- Data to write:", dataToWrite);

  try {
    // Ensure the directory exists
    if (!fs.existsSync(scriptDir)) {
      console.error("SWIGGY directory does not exist:", scriptDir);
      return res.status(500).json({ error: "SWIGGY directory not found" });
    }

    fs.writeFileSync(tempDataPath, JSON.stringify(dataToWrite, null, 2));
    console.log("- File written successfully to:", tempDataPath);
  } catch (err) {
    console.error("Failed to write temp_data.json:", err);
    console.error("- Error details:", err.message);
    console.error("- Error code:", err.code);
    return res.status(500).json({ error: "Failed to prepare input data", details: err.message });
  }

  // Always clean up old containers first
  const downCommand = `cd ${scriptDir} && docker compose down`;
  exec(downCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to bring down old SWIGGY containers:", error.message);
      // Not fatal, continue anyway
    } else {
      console.log("Old SWIGGY containers brought down successfully");
    }

    // First, ensure selenium-chrome is running
    const startSeleniumCommand = `cd ${scriptDir} && docker compose up -d selenium-chrome`;
    exec(startSeleniumCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to start selenium-chrome:", error.message);
        return res.status(500).json({ error: "Failed to start Selenium container", message: error.message });
      }

      console.log("Selenium Chrome started successfully");
      
      // Build the swiggy-bot container to ensure latest code
      const buildSwiggyBotCommand = `cd ${scriptDir} && docker compose build --no-cache swiggy-bot`;
      exec(buildSwiggyBotCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Failed to build swiggy-bot:", error.message);
          return res.status(500).json({ error: "Failed to build SWIGGY bot container", message: error.message });
        }

        console.log("SWIGGY bot built successfully");
        
        // Now start the swiggy-bot container
        const startSwiggyBotCommand = `cd ${scriptDir} && docker compose up -d swiggy-bot`;
        exec(startSwiggyBotCommand, (error, stdout, stderr) => {
          if (error) {
            console.error("SWIGGY bot execution error:", error.message);
            return res.status(500).json({ error: "SWIGGY bot execution failed", message: error.message });
          }

          console.log("SWIGGY bot started successfully");
          
          // Copy the temp_data.json file to the swiggy-bot container
          const copyDataCommand = `docker cp ${tempDataPath} swiggy-swiggy-bot-1:/app/temp_data.json`;
          exec(copyDataCommand, (error, stdout, stderr) => {
            if (error) {
              console.error("Failed to copy data to swiggy-bot container:", error.message);
              return res.status(500).json({ error: "Failed to copy data to container", message: error.message });
            }

            console.log("Data copied to swiggy-bot container successfully");
            
            return res.status(200).json({
              message: "SWIGGY automation triggered successfully",
              output: stdout,
              note: "Check Docker Desktop to see the swiggy-bot container running. Backend is now on port 3000."
            });
          });
        });
      });
    });
  });
};

module.exports = { launchSwiggyScript };