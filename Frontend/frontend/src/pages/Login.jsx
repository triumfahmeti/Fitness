import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("loginForm");
    return saved ? JSON.parse(saved) : { email: "", password: "" };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    localStorage.setItem("loginForm", JSON.stringify(newForm));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/Auth/login", form);
      localStorage.removeItem("loginForm");
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        profile: {
          userId: data.userId,
          email: data.email,
          userName: data.userName,
          name: data.name,
          surname: data.surname,
          roles: data.roles || [],
        },
      });
      const roles = data.roles || [];
      if (roles.includes("Admin")) navigate("/admin", { replace: true });
      else navigate("/user/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: 420 }}>
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="form-control" required />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
