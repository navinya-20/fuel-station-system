const express = require("express");
const router = express.Router();

// TEMP STATIC POINTS (replace with DB later)
router.get("/points/:email", (req, res) => {
  res.json({
    points: 50,
  });
});

module.exports = router;