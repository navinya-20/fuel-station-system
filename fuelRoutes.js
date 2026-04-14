const express = require("express");
const router = express.Router();
const FuelStock = require("../models/fuelStock");
const auth = require("../middleware/authMiddleware");

// GET STOCK (PROTECTED)
router.get("/stock", auth, async (req, res) => {
  const stock = await FuelStock.findOne();
  res.json(stock);
});

module.exports = router;