import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../style.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const id = "admin-style";
    const href = new URL("../../style.css", import.meta.url).href;
    if (!document.getElementById(id)) {
      const el = document.createElement("link");
      el.id = id;
      el.rel = "stylesheet";
      el.href = href;
      document.head.appendChild(el);
    }
  }, []);

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">
          FitLife
        </a>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item">
            <button 
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Admin</div>
                <Link to="/admin/profile" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  My Profile
                </Link>
                <Link to="/admin" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Dashboard
                </Link>
                <Link to="/admin/foods" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  Manage Foods
                </Link>
                <Link to="/admin/exercise" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-dumbbell"></i>
                  </div>
                  Manage Exercises
                </Link>

                <Link to="/admin/users" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-people-group"></i>
                  </div>
                  Manage Users
                </Link>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Admin
            </div>
          </nav>
        </div>

        {/* Content area renders routed pages via Outlet */}
        <div id="layoutSidenav_content">
          <main className="py-4 ">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
