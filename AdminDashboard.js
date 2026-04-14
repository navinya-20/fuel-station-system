import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stock, setStock] = useState({});
  const [price, setPrice] = useState({ petrol: "", diesel: "" });

  const [petrolAdd, setPetrolAdd] = useState("");
  const [dieselAdd, setDieselAdd] = useState("");

  // =======================
  // AUTH HEADER
  // =======================
  const getHeader = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }), []);

  // =======================
  // FETCH DATA
  // =======================
  const fetchUsers = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      getHeader()
    );
    setUsers(res.data || []);
  }, [getHeader]);

  const fetchPurchases = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/purchases",
      getHeader()
    );
    setPurchases(res.data || []);
  }, [getHeader]);

  const fetchStock = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/fuel/stock",
      getHeader()
    );
    setStock(res.data || {});
  }, [getHeader]);

  const fetchPrice = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/get-price",
      getHeader()
    );
    setPrice(res.data);
  }, [getHeader]);

  useEffect(() => {
    fetchUsers();
    fetchPurchases();
    fetchStock();
    fetchPrice();
  }, [fetchUsers, fetchPurchases, fetchStock, fetchPrice]);

  // =======================
  // UPDATE PRICE
  // =======================
  const handleUpdatePrice = async () => {
    await axios.post(
      "http://localhost:5000/api/update-price",
      {
        petrol: Number(price.petrol),
        diesel: Number(price.diesel),
      },
      getHeader()
    );

    alert("✅ Price Updated");
    fetchPrice();
  };

  // =======================
  // UPDATE STOCK
  // =======================
  const handleUpdateStock = async () => {
    await axios.post(
      "http://localhost:5000/api/purchase/update-stock",
      {
        petrol: Number(petrolAdd),
        diesel: Number(dieselAdd),
      },
      getHeader()
    );

    alert("✅ Stock Updated");
    setPetrolAdd("");
    setDieselAdd("");
    fetchStock();
  };

  // =======================
  // ANALYTICS
  // =======================
  const totalRevenue = purchases.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const totalLiters = purchases.reduce(
    (sum, p) => sum + (p.liters || 0),
    0
  );

  // =======================
  // DAILY CHART
  // =======================
  const chartData = () => {
    if (!purchases.length) return null;

    const map = {};

    purchases.forEach((p) => {
      const date = new Date(p.createdAt).toLocaleDateString();

      if (!map[date]) map[date] = 0;

      map[date] += p.liters;
    });

    return {
      labels: Object.keys(map),
      datasets: [
        {
          label: "Daily Fuel Sales (Liters)",
          data: Object.values(map),
        },
      ],
    };
  };

  return (
    <Layout>
      <div className="p-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold">👮 Admin Dashboard</h2>
          <p className="mt-2">Manage fuel system & analytics</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3>Total Revenue</h3>
            <p className="text-xl mt-2">₹{totalRevenue}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3>Total Fuel Sold</h3>
            <p className="text-xl mt-2">{totalLiters} L</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3>Total Users</h3>
            <p className="text-xl mt-2">{users.length}</p>
          </div>
        </div>

        {/* PRICE */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-semibold mb-3">Update Fuel Price</h3>

          <input
            className="p-2 border rounded mr-2"
            value={price.petrol}
            onChange={(e) =>
              setPrice({ ...price, petrol: e.target.value })
            }
            placeholder="Petrol"
          />

          <input
            className="p-2 border rounded mr-2"
            value={price.diesel}
            onChange={(e) =>
              setPrice({ ...price, diesel: e.target.value })
            }
            placeholder="Diesel"
          />

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleUpdatePrice}
          >
            Update Price
          </button>
        </div>

        {/* STOCK */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-semibold mb-3">Fuel Stock</h3>

          <p>
            Petrol: {stock.petrolStock} L{" "}
            {stock.petrolStock < 20 && (
              <span className="text-red-500">⚠ Low</span>
            )}
          </p>

          <p>
            Diesel: {stock.dieselStock} L{" "}
            {stock.dieselStock < 20 && (
              <span className="text-red-500">⚠ Low</span>
            )}
          </p>
        </div>

        {/* REFILL STOCK */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-semibold mb-3">Refill Fuel Stock</h3>

          <input
            className="p-2 border rounded mr-2"
            placeholder="Add Petrol"
            value={petrolAdd}
            onChange={(e) => setPetrolAdd(e.target.value)}
          />

          <input
            className="p-2 border rounded mr-2"
            placeholder="Add Diesel"
            value={dieselAdd}
            onChange={(e) => setDieselAdd(e.target.value)}
          />

          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleUpdateStock}
          >
            Update Stock
          </button>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-semibold mb-3">📊 Daily Sales</h3>

          {!purchases.length ? (
            <p>No data</p>
          ) : (
            <Bar data={chartData()} />
          )}
        </div>

        {/* USERS */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3>Users</h3>
          {users.map((u) => (
            <p key={u._id}>{u.email}</p>
          ))}
        </div>

        {/* PURCHASES */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h3>Purchases</h3>
          {purchases.map((p) => (
            <div key={p._id}>
              <p>{p.email}</p>
              <p>{p.fuelType} - {p.liters} L</p>
              <p>₹{p.amount}</p>
              <hr />
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default AdminDashboard;