import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("registerForm");
    return saved
      ? JSON.parse(saved)
      : { email: "", password: "", name: "", surname: "", birthday: "", gender: "", role: "Client" };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    localStorage.setItem("registerForm", JSON.stringify(newForm));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form };
      const { data } = await api.post("/api/Auth/register", payload);

      localStorage.removeItem("registerForm");
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        profile: {
          userId: data.userId,
          email: data.email,
          name: form.name,
          surname: form.surname,
          birthday: form.birthday,
          gender: form.gender,
          roles: data.roles || [],
        },
      });

      const roles = data.roles || [];
      if (roles.includes("Admin")) navigate("/admin", { replace: true });
      else navigate("/user/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors)
          ? err.response.data.errors.join(", ")
          : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: 520 }}>
        <h2 className="mb-4 text-center">Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" name="name" value={form.name} onChange={onChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Surname</label>
              <input type="text" name="surname" value={form.surname} onChange={onChange} className="form-control" required />
            </div>
          </div>



          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} className="form-control" required />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Birthday</label>
              <input type="date" name="birthday" value={form.birthday} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select name="gender" value={form.gender} onChange={onChange} className="form-select">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-3 mt-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="form-control" required />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select name="role" value={form.role} onChange={onChange} className="form-select">
              <option value="Client">Client</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
