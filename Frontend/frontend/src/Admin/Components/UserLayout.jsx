import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../style.css";

export default function UserLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
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
                <div className="sb-sidenav-menu-heading">User</div>
       
              
                <Link to="/user/profile" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  My Profile
                </Link>

                <Link to="/user/workouts" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-dumbbell"></i>
                  </div>
                  Workouts
                </Link>
                <Link to="/user/meals" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bowl-food"></i>
                  </div>
                  Meals
                </Link>
                <Link to="/user/progress-and-analytics" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  Progress & Analytics
                </Link>
                <Link to="/user/goal-progress" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-crosshairs"></i>
                  </div>
                  Goals
                </Link>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              User
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
