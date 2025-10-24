const express = require("express");
const router = express.Router();

// Simple test route for now
router.get("/", (req, res) => {
  res.json({ message: "User route working!" });
});

module.exports = router;