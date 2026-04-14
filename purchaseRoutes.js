const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchaseModel");
const FuelStock = require("../models/fuelStock");
const FuelPrice = require("../models/fuelPrice");
const sendLowStockAlert = require("../utils/mailer");
// =======================
// PURCHASE
// =======================
router.post("/", async (req, res) => {
  try {
    const { email, liters, fuelType } = req.body;

    const litersNum = Number(liters);

    let stock = await FuelStock.findOne();

    if (!stock) {
      stock = await FuelStock.create({
        petrolStock: 200,
        dieselStock: 150,
      });
    }

    // 🚨 STOCK CHECK
    if (fuelType === "petrol" && stock.petrolStock < litersNum) {
      return res.status(400).json({
        message: "Not enough Petrol in stock ❌",
      });
    }

    if (fuelType === "diesel" && stock.dieselStock < litersNum) {
      return res.status(400).json({
        message: "Not enough Diesel in stock ❌",
      });
    }

    // REDUCE STOCK
    if (fuelType === "petrol") {
      stock.petrolStock -= litersNum;
    } else {
      stock.dieselStock -= litersNum;
    }
    await stock.save();
    // 🚨 LOW STOCK ALERT
if (stock.petrolStock < 20) {
  await sendLowStockAlert(
    `⚠ Petrol stock is LOW: Only ${stock.petrolStock} Liters left`
  );
}

if (stock.dieselStock < 20) {
  await sendLowStockAlert(
    `⚠ Diesel stock is LOW: Only ${stock.dieselStock} Liters left`
  );
}
    // =======================
// UPDATE STOCK (ADMIN)
// =======================
router.post("/update-stock", async (req, res) => {
  try {
    const { petrol, diesel } = req.body;

    let stock = await FuelStock.findOne();

    if (!stock) {
      stock = new FuelStock({
        petrolStock: petrol,
        dieselStock: diesel,
      });
    } else {
      stock.petrolStock += Number(petrol);
      stock.dieselStock += Number(diesel);
    }

    await stock.save();

    res.json({ message: "Stock Updated Successfully ✅", stock });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

    // PRICE
    let priceData = await FuelPrice.findOne();

    if (!priceData) {
      priceData = await FuelPrice.create({
        petrol: 100,
        diesel: 90,
      });
    }

    const pricePerLiter =
      fuelType === "petrol"
        ? priceData.petrol
        : priceData.diesel;

    const totalAmount = litersNum * pricePerLiter;
    const pointsEarned = litersNum * 2;

    // TOTAL POINTS
    const previous = await Purchase.find({ email });
    const totalPoints =
      previous.reduce((sum, p) => sum + (p.pointsEarned || 0), 0) +
      pointsEarned;

    // SAVE
    const newPurchase = new Purchase({
      email,
      liters: litersNum,
      amount: totalAmount,
      pointsEarned,
      fuelType,
    });

    await newPurchase.save();

    res.json({
      fuelType,
      litersPurchased: litersNum,
      pricePerLiter,
      totalAmount,
      pointsEarned,
      totalPoints,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// HISTORY (IMPORTANT)
// =======================
router.get("/history/:email", async (req, res) => {
  try {
    const purchases = await Purchase.find({
      email: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;