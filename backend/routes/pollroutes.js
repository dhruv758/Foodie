const express = require("express");
const { sendPoll } = require("../controller/pollcontroller");

const router = express.Router();

router.post("/poll/start", async (req, res) => {
    try {
        await sendPoll(req,res);

    } catch (error) {
        console.error("❌ Error sending poll:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to send poll." });
        }
    }
});

module.exports = router;
