import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const API_BASE = "https://localhost:7103/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    ageBuckets: {
      "<18": 0,
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45+": 0,
    },
    gender: { Male: 0, Female: 0, Other: 0 },
    topExercises: [],
    topFoods: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Expect backend endpoints to provide aggregated data
        const [clientsRes, ageRes, genderRes, topExRes, topFoodRes] =
          await Promise.all([
            api.get(`${API_BASE}/Stats/clients/total`),
            api.get(`${API_BASE}/Stats/clients/age-buckets`),
            api.get(`${API_BASE}/Stats/clients/gender`),
            api.get(`${API_BASE}/Stats/top/exercises?count=5`),
            api.get(`${API_BASE}/Stats/top/foods?count=5`),
          ]);

        setStats({
          totalClients: clientsRes.data?.total ?? 0,
          ageBuckets: ageRes.data || {},
          gender: genderRes.data || {},
          topExercises: topExRes.data || [],
          topFoods: topFoodRes.data || [],
        });
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ageChartData = {
    labels: Object.keys(stats.ageBuckets),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(stats.ageBuckets),
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const makePercentFormatter =
    (datasetIndex = 0) =>
    (value, ctx) => {
      try {
        const data = ctx.chart.data.datasets[datasetIndex]?.data || [];
        const arr = Array.isArray(data) ? data : [];
        const total = arr.reduce(
          (acc, v) => acc + (typeof v === "number" ? v : Number(v) || 0),
          0
        );
        const val = typeof value === "number" ? value : Number(value) || 0;
        if (!total) return "0%";
        return `${Math.round((val / total) * 100)}%`;
      } catch {
        return "";
      }
    };

  const commonBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        align: "center",
        anchor: "center",
        color: "#fff",
        formatter: makePercentFormatter(0),
        font: { weight: "bold", size: 10 },
        clip: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const data = context.dataset.data || [];
            const total = data.reduce(
              (a, b) => a + (typeof b === "number" ? b : Number(b) || 0),
              0
            );
            const v =
              typeof context.raw === "number"
                ? context.raw
                : Number(context.raw) || 0;
            const p = total ? Math.round((v / total) * 100) : 0;
            return `${context.dataset.label || "Value"}: ${v} (${p}%)`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const genderChartData = {
    labels: Object.keys(stats.gender),
    datasets: [
      {
        label: "Gender Distribution",
        data: Object.values(stats.gender),
        backgroundColor: ["#6f42c1", "#d63384", "#198754"],
      },
    ],
  };

  const genderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      datalabels: {
        formatter: makePercentFormatter(0),
        color: "#fff",
        font: { weight: "bold", size: 10 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const data = context.dataset.data || [];
            const total = data.reduce(
              (a, b) => a + (typeof b === "number" ? b : Number(b) || 0),
              0
            );
            const v =
              typeof context.raw === "number"
                ? context.raw
                : Number(context.raw) || 0;
            const p = total ? Math.round((v / total) * 100) : 0;
            return `${context.label}: ${v} (${p}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  const topExercisesData = {
    labels: stats.topExercises.map((x) => x.name),
    datasets: [
      {
        label: "Used by",
        data: stats.topExercises.map((x) => x.count ?? x.usageCount ?? 0),
        backgroundColor: "#20c997",
      },
    ],
  };

  const topFoodsData = {
    labels: stats.topFoods.map((x) => x.name),
    datasets: [
      {
        label: "Used by",
        data: stats.topFoods.map((x) => x.count ?? x.usageCount ?? 0),
        backgroundColor: "#fd7e14",
      },
    ],
  };

  return (
    <div className="container-fluid py-4 " style={{ minWidth: "70vw" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Dashboard</h2>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {String(error)}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Totals */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-users fa-2x text-primary me-3"></i>
                    <div>
                      <div className="text-muted small">Total Users</div>
                      <div className="h4 mb-0">{stats.totalClients}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Age and Gender */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Age Distribution</h5>
                  <div style={{ height: 240 }}>
                    <Bar data={ageChartData} options={commonBarOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Gender Distribution</h5>
                  <div style={{ height: 240 }}>
                    <Doughnut data={genderChartData} options={genderOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Exercises and Foods */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Top 5 Exercises</h5>
                  <div style={{ height: 240 }}>
                    <Bar data={topExercisesData} options={commonBarOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Top 5 Foods</h5>
                  <div style={{ height: 240 }}>
                    <Bar data={topFoodsData} options={commonBarOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
