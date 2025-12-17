import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post("/api/auth/login", form);
            login({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                profile: {
                    userId: data.userId,
                    email: data.email,
                    userName: data.userName,
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
        <div className="container" style={{ maxWidth: 420 }}>
            <h2 className="mt-5 mb-4">Login</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={form.password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="mt-3">
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
