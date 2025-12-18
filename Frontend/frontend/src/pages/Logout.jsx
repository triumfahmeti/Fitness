import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ width: "100%", maxWidth: 420 }}>
        <h3 className="mb-3">Logging out...</h3>
        <p className="text-muted">You are being logged out. Redirecting to login page.</p>
      </div>
    </div>
  );
}
