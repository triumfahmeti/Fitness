import React, { useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";


export default function AdminLayout() {
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
    // Keep the stylesheet loaded once appended; no cleanup on unmount
  }, []);
  // const navigate = useNavigate();

  // const logout = () => {
  //   navigate("/login");
  // };

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
                <Link className="dropdown-item" to="/admin/profile">
                  My Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/foods">
                  Manage Foods
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/admin/exercise">
                  Manage Exercises
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/admin/users">
                  Manage Users
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
              <button
                className="dropdown-item"
                onClick={() => logout(navigate)}
              >
                Logout
              </button>
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
                <div className="sb-sidenav-menu-heading">Admin</div>
                <Link to="/admin/profile" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  My Profile
                </Link>
                <Link to="/admin/dashboard" className="nav-link">
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
              Start Bootstrap
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
