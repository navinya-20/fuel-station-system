const mongoose = require("mongoose");

const fuelPriceSchema = new mongoose.Schema({
  petrol: Number,
  diesel: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FuelPrice", fuelPriceSchema);