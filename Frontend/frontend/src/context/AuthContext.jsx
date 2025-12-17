import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("authUser");
        return raw ? JSON.parse(raw) : null;
    });

    const login = ({ accessToken, refreshToken, profile }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("authUser", JSON.stringify(profile));
        setUser(profile);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        setUser(null);
        navigate("/login", { replace: true });
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    useEffect(() => {
        const handler = () => {
            const raw = localStorage.getItem("authUser");
            setUser(raw ? JSON.parse(raw) : null);
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
