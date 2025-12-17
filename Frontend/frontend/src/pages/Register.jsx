import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
        userName: "",
        fullName: "",
        role: "Client",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post("/api/auth/register", form);
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
        <div className="container" style={{ maxWidth: 520 }}>
            <h2 className="mt-5 mb-4">Register</h2>
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
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="userName"
                        className="form-control"
                        value={form.userName}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        value={form.fullName}
                        onChange={onChange}
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
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={onChange}
                    >
                        <option value="Client">Client</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <p className="mt-3">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
