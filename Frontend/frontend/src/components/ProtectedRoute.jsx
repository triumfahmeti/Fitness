import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user.roles?.includes(requiredRole)) {
    // User doesn't have the required role
    // Redirect to appropriate dashboard
    if (user.roles?.includes("Admin")) {
      return <Navigate to="/admin" replace />;
    } else if (user.roles?.includes("Client")) {
      return <Navigate to="/user" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
