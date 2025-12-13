import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "https://localhost:7103/api";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/User/${id}`);
        const u = res.data;
        setUser(u);
        setForm({
          name: u.name || "",
          surname: u.surname || "",
          email: u.email || "",
          gender: u.gender || "",
          birthday: u.birthday || "",
        });
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: form.name,
        surname: form.surname,
        email: form.email,
        gender: form.gender,
        birthday: form.birthday,
      };
      await axios.put(`${API_BASE}/User/${id}`, payload);
      setSuccess("User updated succesfully.");
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/User/${id}`);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{String(error)}</div>
      </div>
    );
  if (!user)
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Not found</div>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">User Details</h3>
        <div>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete User
          </button>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleUpdate} className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Surname</label>
              <input
                type="text"
                name="surname"
                className="form-control"
                value={form.surname}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {/* Username not part of UpdateUserDto; keeping email as primary account field */}

            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Birthday</label>
              <input
                type="date"
                name="birthday"
                className="form-control"
                value={form.birthday || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="card-footer bg-white d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
