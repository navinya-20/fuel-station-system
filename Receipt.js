const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  customerEmail: String,
  liters: Number,
  pointsEarned: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Receipt", receiptSchema);