import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProgressAndAnalytics() {
  const clientId = localStorage.getItem("clientId");;

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [newWeight, setNewWeight] = useState(0);  // Store the latest weight input

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const response = await api.get(`/api/Progress/client/${clientId}`);
        setProgressData(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  // Update chart data for each new weight update
  const handleWeightUpdate = async (e) => {
    e.preventDefault();
    const updatedProgress = [...progressData, { weight: newWeight, date: new Date() }];
    setProgressData(updatedProgress); // Add new weight entry to progress data

    await api.post("/api/Progress", {
      clientId,
      weight: newWeight,
      date: new Date(),
    });
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  // Prepare the data for the chart
  const chartData = {
    labels: progressData.map(p => new Date(p.date).toLocaleDateString()),  // Labels by date
    datasets: [
      {
        label: "Weight Progress",
        data: progressData.map(p => p.weight),  // Weight values over time
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="container py-4">
      <h3>Your Progress Over Time</h3>
      
      <div className="row">
        {/* Weight Update Form */}
        <div className="col-12">
          <form onSubmit={handleWeightUpdate}>
            <input
              type="number"
              className="form-control form-control-lg mb-3"
              placeholder="Enter today's weight"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <button type="submit" className="btn btn-dark btn-lg w-100">Update Weight</button>
          </form>
        </div>

        {/* Line Chart */}
        <div className="col-12 mt-4">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}
