import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("danger");
  const [searchQuery, setSearchQuery] = useState("");
  // Default sort is A–Z by name; no letter selector
  const navigate = useNavigate();

  const loadFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7103/api/Food");
      setFoods(res.data || []);
    } catch (err) {
      setError("Failed to load foods.");
      setAlertType("danger");
      setAlertMessage("Failed to load foods.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const deleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food?")) return;
    try {
      await axios.delete(`https://localhost:7103/api/Food/${id}`);
      setFoods((prev) => prev.filter((f) => f.foodId !== id));
      setAlertType("success");
      setAlertMessage("The food was deleted successfully.");
    } catch (err) {
      setAlertType("danger");
      setAlertMessage("The food couldnt be deleted.");
    }
  };

  return (
    <div className="container-fluid py-4 " style={{ minWidth: "75vw" }}>
      {/* Search and A-Z Order */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">
          <i className="fa-solid fa-utensils me-2"></i> List of Food
        </h2>

        <Link to="/admin/foods/add" className="btn btn-primary">
          + Add Food
        </Link>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-6"></div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alertMessage && (
        <div
          className={`alert alert-${alertType} alert-dismissible fade show`}
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMessage(null)}
          ></button>
        </div>
      )}

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Calories(100g)</th>
                <th>Protein(100g)</th>
                <th className="text-center" style={{ width: "160px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-muted text-center">
                    Loading...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted text-center">
                    There is no foods.
                  </td>
                </tr>
              ) : (
                foods
                  .filter((food) => {
                    const name = (food.name || "").toLowerCase();
                    const q = searchQuery.trim().toLowerCase();
                    return q ? name.includes(q) : true;
                  })
                  .sort((a, b) => {
                    const aName = (a.name || "").toLowerCase();
                    const bName = (b.name || "").toLowerCase();
                    return aName.localeCompare(bName);
                  })
                  .map((food) => (
                    <tr key={food.foodId}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() =>
                            navigate(`/admin/foods/${food.foodId}`)
                          }
                        >
                          {food.name}
                        </button>
                      </td>
                      <td>{food.caloriesPer100g}</td>
                      <td>{food.proteinPer100g}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navigate(`/admin/foods/${food.foodId}/edit`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteFood(food.foodId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
