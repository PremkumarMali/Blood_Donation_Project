import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import VeinBackground from "../components/VeinBackground";
import Footer from "../components/Footer";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setCursorPos({ x, y });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div 
      className="min-vh-100 d-flex flex-column position-relative"
      onMouseMove={handleMouseMove}
      style={{ '--cursor-x': `${cursorPos.x}%`, '--cursor-y': `${cursorPos.y}%` }}
    >
      <VeinBackground />
      
      {/* 🔹 TOP GLASS NAVBAR */}
      <nav className="navbar navbar-expand-lg glass-nav sticky-top">
        <div className="container-fluid px-5"> {/* Using container-fluid for max width */}
          <Link className="navbar-brand fs-3 d-flex align-items-center" to="/user" style={{textDecoration: 'none'}}>
            <span className="brand-animated-bg">❤️ BloodLink</span>
          </Link>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link to="/user" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Dashboard</Link>
              </li>
              
              <li className="nav-item">
                <Link to="/user/find-donor" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Find Donor</Link>
              </li>
              <li className="nav-item">
                <Link to="/user/donate-blood" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Donate Blood</Link>
              </li>
              <li className="nav-item">
                <Link to="/user/profile" className="nav-link fw-medium" style={{color: 'var(--text-color)'}}>Profile</Link>
              </li>

              <li className="nav-item ms-3">
                <span className="badge bg-danger rounded-pill px-3 py-2">
                   Donor: {user.username}
                </span>
              </li>
              <li className="nav-item ms-2">
                <button
                  className="btn btn-outline-danger rounded-pill px-4 btn-sm"
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
      <main className="container-fluid py-5 page-enter flex-grow-1">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* 🔹 FOOTER */}
      <Footer />
    </div>
  );
}

export default DashboardLayout;