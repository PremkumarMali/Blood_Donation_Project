import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import VeinBackground from "../components/VeinBackground";

function HospitalLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Hospital" };
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
      <nav className="navbar navbar-expand-lg glass-nav">
        <div className="container-fluid px-5">
          <Link className="navbar-brand fs-3 d-flex align-items-center" to="/hospital" style={{textDecoration: 'none'}}>
            <span className="brand-animated-bg">❤️ BloodLink Hospital</span>
          </Link>
          
          <button className="navbar-toggler border-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link to="/hospital" className="nav-link text-white fw-medium">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/hospital/orders" className="nav-link text-white fw-medium">Blood Requests</Link>
              </li>              
              <li className="nav-item">
                <Link to="/hospital/profile" className="nav-link text-white fw-medium">Profile</Link>
              </li>

              <li className="nav-item ms-3">
                <span className="badge rounded-pill px-3 py-2" style={{backgroundColor: '#00695C', border: '1px solid #4FC3F7'}}>
                   {user.username}
                </span>
              </li>
              <li className="nav-item ms-3">
                <button
                  className="btn btn-outline-light rounded-pill px-4 btn-sm"
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

export default HospitalLayout;