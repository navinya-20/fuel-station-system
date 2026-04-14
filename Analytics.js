import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Analytics() {
  const [data, setData] = useState({ petrol: 0, diesel: 0 });

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase");

      let petrol = 0;
      let diesel = 0;

      res.data.forEach((item) => {
        if (item.fuelType === "petrol") petrol += item.liters;
        if (item.fuelType === "diesel") diesel += item.liters;
      });

      setData({ petrol, diesel });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Fuel Analytics</h2>

      <button onClick={fetchData} style={{ marginBottom: "10px" }}>
        Refresh Data
      </button>

      <Bar
        data={{
          labels: ["Petrol", "Diesel"],
          datasets: [
            {
              label: "Fuel Sales (Liters)",
              data: [data.petrol, data.diesel],
              backgroundColor: ["#f97316", "#3b82f6"],
            },
          ],
        }}
      />
    </div>
  );
}

export default Analytics;