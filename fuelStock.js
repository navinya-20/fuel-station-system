const mongoose = require("mongoose");

const fuelStockSchema = new mongoose.Schema({
  petrolStock: Number,
  dieselStock: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FuelStock", fuelStockSchema);