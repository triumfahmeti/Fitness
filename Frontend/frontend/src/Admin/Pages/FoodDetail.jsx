import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const API_BASE = "https://localhost:7103/api";

export default function FoodDetail() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/Food/${id}`);
        setFood(res.data);
      } catch (err) {
        setError(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container py-3">Loading...</div>;
  if (error)
    return (
      <div className="container py-3">
        <div className="alert alert-danger">{String(error)}</div>
      </div>
    );
  if (!food)
    return (
      <div className="container py-3">
        <div className="alert alert-warning">Not found</div>
      </div>
    );

  // Build absolute image URL if backend returned a relative path (e.g., /images/abc.jpg)
  const API_ORIGIN = API_BASE.replace(/\/(api)$/i, "");
  const imageSrc = food.imageUrl
    ? food.imageUrl.startsWith("http")
      ? food.imageUrl
      : `${API_ORIGIN}${
          food.imageUrl.startsWith("/") ? food.imageUrl : "/" + food.imageUrl
        }`
    : null;

  return (
    <div className="bg-light">
      <div className="container py-5">
        {/* Header */}
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-start">
              <div className="text-center w-100">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={food.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="shadow"
                    style={{
                      maxWidth: 220,
                      maxHeight: 220,
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow"
                    style={{ width: 120, height: 120 }}
                  >
                    <i className="fa-solid fa-utensils fa-3x text-secondary"></i>
                  </div>
                )}
                <h3 className="mt-3 mb-1">{food.name}</h3>

                <p className="text-muted mb-0">Food</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Nutritional Information (per 100g)</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Calories</label>
                    <input
                      type="text"
                      className="form-control"
                      value={food.caloriesPer100g ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Protein (g)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={food.proteinPer100g ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Carbs (g)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={food.carbsPer100g ?? ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fat (g)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={food.fatPer100g ?? ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
