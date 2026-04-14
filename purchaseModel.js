const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    email: String,
    liters: Number,
    amount: Number,
    pointsEarned: Number,
    fuelType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);