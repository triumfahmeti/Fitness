import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination";

const API_BASE = "https://localhost:7103/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("danger");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${API_BASE}/User`);
      setUsers(res.data || []);
    } catch (err) {
      setAlertType("danger");
      setAlertMessage("Couldnt load User List.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`${API_BASE}/User/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setAlertType("success");
      setAlertMessage("User deleted successfully.");
    } catch (err) {
      setAlertType("danger");
      setAlertMessage("Failed to delete user.");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minWidth: "75vw" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">
          <i className="fa-solid fa-users me-2"></i> Manage Users
        </h2>
      </div>

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
          </div>
        </div>
      </div>

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

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>*</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-center" style={{ width: "220px" }}>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                (() => {
                  const filtered = users.filter((u) => {
                    const fullName = `${u.name || ""} ${u.surname || ""}`
                      .trim()
                      .toLowerCase();
                    const q = searchQuery.trim().toLowerCase();
                    return q ? fullName.includes(q) : true;
                  });
                  const sorted = filtered.sort((a, b) => {
                    const aFull = `${a.name || ""} ${a.surname || ""}`.trim();
                    const bFull = `${b.name || ""} ${b.surname || ""}`.trim();
                    return aFull.localeCompare(bFull);
                  });
                  const total = sorted.length;
                  const totalPages = Math.max(1, Math.ceil(total / pageSize));
                  const currentPage = Math.min(page, totalPages);
                  const startIdx = (currentPage - 1) * pageSize;
                  const pageItems = sorted.slice(startIdx, startIdx + pageSize);
                  return (
                    <>
                      {pageItems.map((u, idx) => (
                        <tr key={u.id}>
                          <td>{startIdx + idx + 1}</td>
                          <td>
                            <Link
                              to={`/admin/users/${u.id}`}
                              className="text-decoration-none"
                            >
                              {u.name} {u.surname}
                            </Link>
                          </td>
                          <td>{u.email}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                navigate(`/admin/users/${u.id}/edit`)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteUser(u.id)}
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
