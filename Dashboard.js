import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Layout from "../components/Layout";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [liters, setLiters] = useState("");
  const [fuelType, setFuelType] = useState("petrol");

  const [points, setPoints] = useState(0);
  const [price, setPrice] = useState({ petrol: 0, diesel: 0 });
  const [stock, setStock] = useState({ petrolStock: 0, dieselStock: 0 });
  const [receipt, setReceipt] = useState(null);
  const [history, setHistory] = useState([]);

  // =======================
  // AUTH HEADER
  // =======================
  const getHeader = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  }, []);

  // =======================
  // FETCH POINTS
  // =======================
  const fetchPoints = useCallback(async (userEmail) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/points/${userEmail}`,
        getHeader()
      );

      setPoints(
        res.data.points ||
        res.data.loyaltyPoints ||
        res.data.totalPoints ||
        0
      );
    } catch (err) {
      console.log("Points Error:", err.message);
    }
  }, [getHeader]);

  // =======================
  // FETCH PRICE
  // =======================
  const fetchPrice = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/get-price",
        getHeader()
      );

      setPrice({
        petrol: res.data.petrol || 0,
        diesel: res.data.diesel || 0,
      });
    } catch (err) {
      console.log("Price Error:", err.message);
    }
  }, [getHeader]);

  // =======================
  // FETCH STOCK
  // =======================
  const fetchStock = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/fuel/stock",
        getHeader()
      );

      setStock({
        petrolStock: res.data.petrolStock || 0,
        dieselStock: res.data.dieselStock || 0,
      });
    } catch (err) {
      console.log("Stock Error:", err.message);
    }
  }, [getHeader]);

  // =======================
  // FETCH HISTORY
  // =======================
  const fetchHistory = useCallback(async (userEmail) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/purchase/history/${userEmail}`,
        getHeader()
      );

      setHistory(res.data || []);
    } catch (err) {
      console.log("History Error:", err.message);
    }
  }, [getHeader]);

  // =======================
  // INITIAL LOAD
  // =======================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      setEmail(user.email);
      fetchPoints(user.email);
      fetchHistory(user.email);
    }

    fetchPrice();
    fetchStock();
  }, [fetchPoints, fetchHistory, fetchPrice, fetchStock]);

  // =======================
  // PURCHASE
  // =======================
  const handlePurchase = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/purchase",
        {
          email,
          liters: Number(liters),
          fuelType, // 🔥 NEW
        },
        getHeader()
      );

      setReceipt(res.data);
      setPoints(res.data.totalPoints || 0);
      setLiters("");

      // refresh
      fetchHistory(email);
      fetchStock();

    } catch (err) {
      console.log("Purchase Error:", err.message);
      alert("Purchase failed");
    }
  };

  // =======================
  // PDF DOWNLOAD
  // =======================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Fuel Station Receipt", 20, 20);
    doc.text(`Email: ${email}`, 20, 40);
    doc.text(`Fuel Type: ${receipt.fuelType}`, 20, 50);
    doc.text(`Liters: ${receipt.litersPurchased}`, 20, 60);
    doc.text(`Price/L: ₹${receipt.pricePerLiter}`, 20, 70);
    doc.text(`Total: ₹${receipt.totalAmount}`, 20, 80);
    doc.text(`Points Earned: ${receipt.pointsEarned}`, 20, 90);
    doc.text(`Total Points: ${receipt.totalPoints}`, 20, 100);

    doc.save("receipt.pdf");
  };

  // =======================
  // UI STYLE
  // =======================
  const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <Layout>
      <div>

        <h2>⛽ Fuel Dashboard</h2>

        {/* USER */}
        <div style={cardStyle}>
          <h3>User Info</h3>
          <p>Email: {email}</p>
          <p>Points: {points}</p>
        </div>

        {/* STOCK */}
        <div style={cardStyle}>
          <h3>Fuel Stock</h3>
          <p>Petrol: {stock.petrolStock} L</p>
          <p>Diesel: {stock.dieselStock} L</p>
          <p>
  Petrol: {stock.petrolStock} L 
  {stock.petrolStock < 20 && (
    <span style={{ color: "red" }}> ⚠ Low</span>
  )}
</p>

<p>
  Diesel: {stock.dieselStock} L 
  {stock.dieselStock < 20 && (
    <span style={{ color: "red" }}> ⚠ Low</span>
  )}
</p>
        </div>

        {/* PRICE */}
        <div style={cardStyle}>
          <h3>Fuel Price</h3>
          <p>Petrol: ₹{price.petrol}</p>
          <p>Diesel: ₹{price.diesel}</p>
        </div>

        {/* PURCHASE */}
        <div style={cardStyle}>
          <h3>Buy Fuel</h3>

          {/* 🔥 FUEL TYPE SELECT */}
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>

          <br /><br />

          <input
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            placeholder="Enter liters"
          />

          <button onClick={handlePurchase}>Buy</button>
        </div>

        {/* RECEIPT */}
        {receipt && (
          <div style={cardStyle}>
            <h3>Receipt</h3>

            <p>Fuel Type: {receipt.fuelType}</p>
            <p>Liters: {receipt.litersPurchased}</p>
            <p>Price per Liter: ₹{receipt.pricePerLiter}</p>
            <p>Total Amount: ₹{receipt.totalAmount}</p>

            <p>Points Earned: {receipt.pointsEarned}</p>
            <p>Total Points: {receipt.totalPoints}</p>

            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        )}

        {/* HISTORY */}
        <div style={cardStyle}>
          <h3>Purchase History</h3>

          {history.length === 0 ? (
            <p>No purchases yet</p>
          ) : (
            history.map((item) => (
              <div key={item._id}>
                <p>{item.fuelType} - {item.liters} L</p>
                <p>₹{item.amount}</p>
                <p>{new Date(item.createdAt).toLocaleString()}</p>
                <hr />
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;