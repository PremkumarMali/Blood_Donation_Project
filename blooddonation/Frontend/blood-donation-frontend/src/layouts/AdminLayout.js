import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import VeinBackground from "../components/VeinBackground";

function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Admin" };
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
          <Link className="navbar-brand fs-3 fw-bolder text-white d-flex align-items-center" to="/admin" style={{textDecoration: 'none', letterSpacing: '1px'}}>
            <span className="brand-animated-bg">❤️ BloodLink Admin</span>
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
              <li className="nav-item mx-2">
                <Link to="/admin/profile" className="nav-link text-white fw-medium">Profile</Link>
              </li>

              <li className="nav-item mx-2">
                <span className="badge rounded-pill px-3 py-2 ms-2" style={{backgroundColor: '#6A1B9A', border: '1px solid #FB8C00'}}>
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

export default AdminLayout;