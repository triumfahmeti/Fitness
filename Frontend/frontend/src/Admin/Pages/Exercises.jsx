import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("danger");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Map enum value to readable category name
  const getCategoryLabel = (ex) => {
    if (typeof ex?.categoryName === "string" && ex.categoryName.trim().length) {
      return ex.categoryName;
    }
    const cat = ex?.category;
    const MAP = {
      0: "Chest",
      1: "Back",
      2: "Legs",
      3: "Arms",
      4: "Shoulders",
      5: "Core",
    };
    if (typeof cat === "number") return MAP[cat] ?? `Category ${cat}`;
    if (typeof cat === "string") return cat;
    return "N/A";
  };

  const loadExercises = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://localhost:7103/api/Exercise");
      setExercises(res.data || []);
    } catch (err) {
      setAlertType("danger");
      setAlertMessage("Couldnt load exercise list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const deleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?"))
      return;
    try {
      await axios.delete(`https://localhost:7103/api/Exercise/${id}`);
      setExercises((prev) => prev.filter((e) => e.exerciseId !== id));
      setAlertType("success");
      setAlertMessage("Exercise deleted successfully.");
    } catch (err) {
      setAlertType("danger");
      setAlertMessage("Failed to delete exercise.");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minWidth: "75vw" }}>
      {/* Header + Add button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">
          <i className="fa-solid fa-dumbbell me-2"></i> List of Exercises
        </h2>
        <Link to="/admin/exercise/add" className="btn btn-primary">
          + Add Exercise
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
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by category..."
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
              />
            </div>
            {/* Page size now controlled via Pagination component in table footer */}
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
                <th style={{ width: "60px" }}>*</th>
                <th>Name</th>
                <th>Category</th>
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
              ) : exercises.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted text-center">
                    No exercises found.
                  </td>
                </tr>
              ) : (
                (() => {
                  const filtered = exercises.filter((ex) => {
                    const name = (ex.name || "").toLowerCase();
                    const q = searchQuery.trim().toLowerCase();
                    if (q && !name.includes(q)) return false;

                    const catLabel = getCategoryLabel(ex).toLowerCase();
                    const cq = categoryQuery.trim().toLowerCase();
                    if (cq && !catLabel.includes(cq)) return false;

                    return true;
                  });
                  const sorted = filtered.sort((a, b) => {
                    const aName = (a.name || "").toLowerCase();
                    const bName = (b.name || "").toLowerCase();
                    return aName.localeCompare(bName);
                  });

                  const total = sorted.length;
                  const totalPages = Math.max(1, Math.ceil(total / pageSize));
                  const currentPage = Math.min(page, totalPages);
                  const startIdx = (currentPage - 1) * pageSize;
                  const pageItems = sorted.slice(startIdx, startIdx + pageSize);

                  return (
                    <>
                      {pageItems.map((ex, idx) => (
                        <tr key={ex.exerciseId}>
                          <td>{startIdx + idx + 1}</td>
                          <td>
                            <Link
                              to={`/admin/exercise/${ex.exerciseId}`}
                              className="text-decoration-none"
                            >
                              {ex.name}
                            </Link>
                          </td>
                          <td>{getCategoryLabel(ex)}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                navigate(
                                  `/admin/exercise/${ex.exerciseId}/edit`
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteExercise(ex.exerciseId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      <Pagination
                        total={total}
                        page={currentPage}
                        pageSize={pageSize}
                        onPageChange={(p) => setPage(p)}
                        onPageSizeChange={(ps) => {
                          setPageSize(ps);
                          setPage(1);
                        }}
                        colSpan={4}
                      />
                    </>
                  );
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
