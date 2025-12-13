import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const adminId = localStorage.getItem("adminId");
    const adminId = "2";

    if (!adminId) {
      setError("Missing adminId in localStorage");
      setLoading(false);
      return;
    }
    axios
      .get(`https://localhost:7103/api/admin/${adminId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        const msg = err.response?.data || err.message;
        setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      })
      .finally(() => setLoading(false));
  }, []);

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
          Failed to load profile: {error}
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

  const { email, name, surname, birthday, gender } = profile;

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
              <h3 className="mt-3 mb-1">{name || "Admin"}</h3>
              <p className="text-muted mb-0">{"Administrator"}</p>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={surname || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Birthday</label>
                    <input
                      type="text"
                      className="form-control"
                      value={birthday || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gender || ""}
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

export default AdminProfile;
