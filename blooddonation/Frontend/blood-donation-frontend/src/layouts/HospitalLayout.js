import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import VeinBackground from "../components/VeinBackground";

function HospitalLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Hospital" };
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Theme is globally managed
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
      {/* 🔹 TOP DASHBOARD NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="container-fluid px-5 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand d-flex align-items-center" to="/hospital" style={{textDecoration: 'none'}}>
            <span className="brand-animated-bg fs-4">❤️ BloodLink Hospital</span>
          </Link>
          
          <div className="d-flex align-items-center gap-4">
            <Link to="/hospital" className="nav-link">Dashboard</Link>
            <Link to="/hospital/orders" className="nav-link">Blood Requests</Link>
            <Link to="/hospital/profile" className="nav-link">Profile</Link>
            
            <span className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm">
               Hospital: {user.username}
            </span>
            
            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
              Logout
            </button>
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

export default HospitalLayout;