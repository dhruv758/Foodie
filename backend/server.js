// server.js
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB } = require("./config/db");
require("./utils/recurringPollRunner.js");

const app = express();
dotenv.config();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cors({
  origin: [
    "https://foodie-c255.onrender.com",
    "https://d1ljzcz0mv3gix.cloudfront.net",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Import your launch controller
const { launchSwiggyScript } = require("./controller/launchController");

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/swiggy.js"));      // includes POST /api/launch-swiggy
app.use("/api/polls", require("./routes/poll_routes.js"));
app.use("/api/slack", require("./routes/slack_routes.js"));
app.use("/api", require("./routes/pollroutes.js"));

// ✅ Test route to verify Render → EC2 connectivity
app.get("/test-ec2", async (req, res) => {
  try {
    // dynamically import fetch for CommonJS compatibility
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const response = await fetch("http://13.204.80.58:5000/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "ping" }),
      // optional: no timeout with fetch, but will error if cannot connect
    });
    const data = await response.json();
    return res.json({ success: true, result: data });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Cannot reach EC2", detail: err.message });
  }
});

// Root health check
app.get("/", (req, res) => res.send("Server is running"));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
