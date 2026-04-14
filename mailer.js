const nodemailer = require("nodemailer");

// CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "navinya0120@gmail.com",        // 🔥 your email
    pass: "kxanoxaeihdohyvc",           // 🔥 app password
  },
});

// SEND ALERT
const sendLowStockAlert = async (message) => {
  try {
    const info = await transporter.sendMail({
      from: "navinya0120@gmail.com",
      to: "navinyamarimuthu@gmail.com", // admin email
      subject: "⚠ Fuel Stock Alert",
      text: message,
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.log("❌ Email Error:", err.message);
  }
};

module.exports = sendLowStockAlert;