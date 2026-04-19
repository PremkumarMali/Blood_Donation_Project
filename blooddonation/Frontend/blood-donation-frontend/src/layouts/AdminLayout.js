import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Admin" };
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-admin min-vh-100">
      {/* 🔹 TOP GLASS NAVBAR */}
      <nav className="navbar navbar-expand-lg glass-nav">
        <div className="container">
          <Link className="navbar-brand fw-bold text-white fs-3 d-flex align-items-center" to="/admin">
            <span className="me-2 text-white"></span> Blood Bank Manager
          </Link>
          
          <button className="navbar-toggler border-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-2">
                <Link to="/admin" className="nav-link text-white fw-medium">Dashboard</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/admin/storage" className="nav-link text-white fw-medium">Blood Storage</Link>
              </li>

              {/* 🎨 THEME SWITCHER */}
              <li className="nav-item ms-3">
                <div className="btn-group btn-group-sm glass-card p-1">
                  <button 
                    className={`btn btn-sm rounded-pill ${theme === 'light' ? 'btn-warning' : 'text-white'}`}
                    onClick={() => setTheme('light')}
                  >☀️</button>
                  <button 
                    className={`btn btn-sm rounded-pill ${theme === 'dark' ? 'btn-warning' : 'text-white'}`}
                    onClick={() => setTheme('dark')}
                  >🌙</button>
                </div>
              </li>

              <li className="nav-item mx-2">
                <span className="badge rounded-pill px-3 py-2 ms-3" style={{backgroundColor: '#6A1B9A', border: '1px solid #FB8C00'}}>
                   Admin: {user.username}
                </span>
              </li>
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-light rounded-pill px-4"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🔹 MAIN CONTENT */}
      <main className="container-fluid py-5 page-enter">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;