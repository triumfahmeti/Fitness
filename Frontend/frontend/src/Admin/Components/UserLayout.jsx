import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../style.css";

export default function UserLayout() {
  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">
          FitLife
        </a>
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-bars"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <Link className="dropdown-item" to="/user/profile">
                  My Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/user/dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/user/workouts">
                  My Workouts
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/user/meals">
                  My Meals
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarUser"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarUser"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <button className="dropdown-item">Logout</button>
            </ul>
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
                <Link to="/user/progress&analytics" className="nav-link">
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
