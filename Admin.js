import React, { useState } from "react";
import axios from "axios";

function Admin() {
  const [petrol, setPetrol] = useState("");
  const [diesel, setDiesel] = useState("");
  const [petrolStock, setPetrolStock] = useState("");
  const [dieselStock, setDieselStock] = useState("");

  const updatePrice = async () => {
    try {
      await axios.post("http://localhost:5000/api/update-price", {
        petrol,
        diesel,
      });

      alert("Price updated ✅");
    } catch (err) {
      alert("Error ❌");
    }
  };

  const updateStock = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/update-stock",
        {
          petrolStock,
          dieselStock,
        }
      );

      alert(res.data.alert);
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Panel 👑</h1>

      {/* Price Update */}
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="font-semibold mb-3">Update Price</h2>

        <input
          placeholder="Petrol Price"
          value={petrol}
          onChange={(e) => setPetrol(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          placeholder="Diesel Price"
          value={diesel}
          onChange={(e) => setDiesel(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <button
          onClick={updatePrice}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Update Price
        </button>
      </div>

      {/* Stock Update */}
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="font-semibold mb-3">Update Stock</h2>

        <input
          placeholder="Petrol Stock"
          value={petrolStock}
          onChange={(e) => setPetrolStock(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          placeholder="Diesel Stock"
          value={dieselStock}
          onChange={(e) => setDieselStock(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <button
          onClick={updateStock}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Update Stock
        </button>
      </div>

    </div>
  );
}

export default Admin;