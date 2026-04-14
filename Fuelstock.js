import React, { useEffect, useState } from "react";
import axios from "axios";

const FuelStock = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fuel stock from backend
  const fetchStock = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fuel/stock");
      setStock(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>⛽ Fuel Stock Dashboard</h2>

      {loading ? (
        <p>Loading stock...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Fuel Type</th>
              <th>Available Litres</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item._id}>
                <td>{item.fuelType}</td>
                <td>{item.litres}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FuelStock;