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
          adminId: data.adminId || null,
          clientId: data.clientId || null,
        },
      });
      const roles = data.roles || [];
      if (roles.includes("Admin")) navigate("/admin", { replace: true });
      else navigate("/user/profile", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: 420 }}
      >
        <h2 className="mb-4 text-center">Login</h2>
        {error && (
          <div id="login-error" className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <button
            id="login-button"
            type="button"
            className="btn btn-primary w-100"
            disabled={loading}
            onClick={onSubmit}
          >
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
