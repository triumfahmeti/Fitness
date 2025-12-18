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
    
    // Store roles for authorization
    if (profile.roles && profile.roles.length > 0) {
      localStorage.setItem("userRole", profile.roles[0]); // Store primary role
      localStorage.setItem("userRoles", JSON.stringify(profile.roles));
    }
    
    // Store role-specific ID
    if (profile.adminId !== null && profile.adminId !== undefined) {
      localStorage.setItem("adminId", String(profile.adminId));
    }
    if (profile.clientId !== null && profile.clientId !== undefined) {
      localStorage.setItem("clientId", String(profile.clientId));
    }
    
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("adminId");
    localStorage.removeItem("clientId");
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Listen to localStorage changes (multi-tab)
  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem("authUser");
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
