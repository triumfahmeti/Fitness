import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://localhost:7103/api";

export default function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientId: null,
    userId: "",
    email: "",
    name: "",
    surname: "",
    birthday: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
  });

  useEffect(() => {
    // Prefer clientId from localStorage; fallback for development/demo
    const clientId = localStorage.getItem("clientId") || "1";
    if (!clientId) {
      setError("Missing clientId");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${API_BASE}/Client/${clientId}`)
      .then((res) => {
        const c = res.data;
        setProfile(c);
        setForm({
          clientId: c.clientId,
          userId: c.userId,
          email: c.email || "",
          name: c.name || "",
          surname: c.surname || "",
          birthday: c.birthday || "",
          gender: c.gender || "",
          weight: String(c.weight ?? ""),
          height: String(c.height ?? ""),
          activityLevel: String(c.activityLevel ?? ""),
        });
      })
      .catch((err) => {
        const msg = err.response?.data || err.message;
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    if (profile) {
      setForm({
        clientId: profile.clientId,
        userId: profile.userId,
        email: profile.email || "",
        name: profile.name || "",
        surname: profile.surname || "",
        birthday: profile.birthday || "",
        gender: profile.gender || "",
        weight: String(profile.weight ?? ""),
        height: String(profile.height ?? ""),
        activityLevel: String(profile.activityLevel ?? ""),
      });
    }
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      // Update client record with available fields to avoid User endpoint validation (Password required)
      await axios.put(`${API_BASE}/Client/${form.clientId}`, {
        userId: form.userId,
        email: form.email,
        name: form.name,
        surname: form.surname,
        birthday: form.birthday,
        gender: form.gender,
        weight: parseFloat(form.weight || 0),
        height: parseFloat(form.height || 0),
        activityLevel: isNaN(parseInt(form.activityLevel, 10))
          ? form.activityLevel
          : parseInt(form.activityLevel, 10),
      });

      setProfile({
        clientId: form.clientId,
        userId: form.userId,
        email: form.email,
        name: form.name,
        surname: form.surname,
        birthday: form.birthday,
        gender: form.gender,
        weight: parseFloat(form.weight || 0),
        height: parseFloat(form.height || 0),
        activityLevel: isNaN(parseInt(form.activityLevel, 10))
          ? form.activityLevel
          : parseInt(form.activityLevel, 10),
      });
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data || err.message;
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minWidth: "40vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Failed to load or save: {String(error)}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          No profile data available.
        </div>
      </div>
    );

  return (
    <div className="bg-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow"
                style={{ width: 120, height: 120 }}
              >
                <i className="fa-solid fa-user fa-3x text-secondary"></i>
              </div>
              <h3 className="mt-3 mb-1">{profile.name || "Client"}</h3>
              <p className="text-muted mb-0">Client</p>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Personal Information</h5>
                  {!editing ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={startEdit}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={saving}
                        onClick={save}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="surname"
                      value={form.surname}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      readOnly={!editing}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Birthday</label>
                    <input
                      type="date"
                      className="form-control"
                      name="birthday"
                      value={form.birthday || ""}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    {editing ? (
                      <select
                        className="form-select"
                        name="gender"
                        value={form.gender || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="gender"
                        value={form.gender || ""}
                        readOnly
                      />
                    )}
                  </div>

                  <div className="col-12 mt-4">
                    <h5 className="mb-2">Fitness Details</h5>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Activity Level</label>
                    {editing ? (
                      <select
                        className="form-select"
                        name="activityLevel"
                        value={form.activityLevel}
                        onChange={handleChange}
                      >
                        <option value="0">Not Active</option>
                        <option value="1">Lightly Active</option>
                        <option value="2">Moderately Active</option>
                        <option value="3">Very Active</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="activityLevel"
                        value={
                          {
                            0: "Not Active",
                            1: "Lightly Active",
                            2: "Moderately Active",
                            3: "Very Active",
                          }[String(form.activityLevel)] ||
                          String(form.activityLevel)
                        }
                        readOnly
                      />
                    )}
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
