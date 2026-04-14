const express = require("express");
const router = express.Router();
const FuelPrice = require("../models/fuelPrice");

// =======================
// GET PRICE
// =======================
router.get("/get-price", async (req, res) => {
  try {
    let price = await FuelPrice.findOne();

    // If no price exists → create default
    if (!price) {
      price = await FuelPrice.create({
        petrol: 105,
        diesel: 92,
      });
    }

    res.json({
      petrol: price.petrol,
      diesel: price.diesel,
    });

  } catch (err) {
    console.log("Price Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// UPDATE PRICE (ADMIN)
// =======================
router.post("/update-price", async (req, res) => {
  try {
    const { petrol, diesel } = req.body;

    let price = await FuelPrice.findOne();

    if (!price) {
      price = new FuelPrice();
    }

    price.petrol = Number(petrol);
    price.diesel = Number(diesel);
    price.updatedAt = new Date();

    await price.save();

    res.json({
      message: "Price updated successfully",
      petrol: price.petrol,
      diesel: price.diesel,
    });

  } catch (err) {
    console.log("Update Price Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;