import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import VeinBackground from "../components/VeinBackground";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
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
    <div className="min-vh-100 position-relative">
      <VeinBackground />
      
      {/* 🔹 TOP GLASS NAVBAR */}
      <nav className="navbar navbar-expand-lg glass-nav sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3 d-flex align-items-center" to="/user" style={{color: 'var(--text-color)'}}>
            ❤️ BloodLink
          </Link>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-2">
                <Link to="/user" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Dashboard</Link>
              </li>
              
              {/* 🎨 THEME SWITCHER */}
              <li className="nav-item ms-3">
                <div className="btn-group btn-group-sm glass-card p-1">
                  <button 
                    className={`btn btn-sm rounded-pill ${theme === 'light' ? 'btn-danger' : 'text-muted'}`}
                    onClick={() => setTheme('light')}
                  >☀️</button>
                  <button 
                    className={`btn btn-sm rounded-pill ${theme === 'dark' ? 'btn-danger' : 'text-muted'}`}
                    onClick={() => setTheme('dark')}
                  >🌙</button>
                  <button 
                    className={`btn btn-sm rounded-pill ${theme === 'blood' ? 'btn-danger' : 'text-muted'}`}
                    onClick={() => setTheme('blood')}
                  >🩸</button>
                </div>
              </li>
              <li className="nav-item mx-2">
                <Link to="/user/find-donor" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Find Donor</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/user/donate-blood" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Donate Blood</Link>
              </li>
              <li className="nav-item mx-2">
                <Link to="/user/profile" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Profile</Link>
              </li>
              <li className="nav-item mx-2">
                <span className="badge bg-danger rounded-pill px-3 py-2 ms-3">
                   Donor: {user.username}
                </span>
              </li>
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-danger rounded-pill px-4"
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

export default DashboardLayout;