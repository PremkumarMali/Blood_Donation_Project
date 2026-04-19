import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";

import DonationAwareness from "../components/DonationAwareness";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
        role,
      });

      if (response.data && response.data.role) {
        setLoggedInUser(response.data);
        setShowWelcome(true);
      } else {
        setError("Invalid credentials or role.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : "Login failed. Please try again.");
      } else {
        setError("Backend server is not running.");
      }
    }
  };

  const finalizeLogin = () => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    if (loggedInUser.role === "ADMIN") navigate("/admin");
    else if (loggedInUser.role === "HOSPITAL") navigate("/hospital");
    else navigate("/user");
  };

  if (showWelcome) {
    return <WelcomeScreen username={loggedInUser.username} onComplete={finalizeLogin} />;
  }

  return (
    <div className="auth-fullscreen">
      <DonationAwareness />
      
      <div className="glass-card auth-card page-enter p-5" style={{ marginLeft: "auto", marginRight: "10%" }}>
        <div className="text-center mb-4">
          <div className="auth-icon">❤️</div>
          <h2 className="fw-bold mt-3" style={{ fontSize: "1.8rem" }}>Welcome Back</h2>
          <p className="text-muted">Save lives by donating blood</p>
        </div>

        {error && <div className="alert alert-danger py-2 rounded-3">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-uppercase text-muted">Username</label>
            <input
              type="text"
              className="form-control form-control-lg auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-uppercase text-muted">Password</label>
            <input
              type="password"
              className="form-control form-control-lg auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-uppercase text-muted">I am a...</label>
            <select
              className="form-select form-select-lg auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Donor / User</option>
              <option value="HOSPITAL">Hospital</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn btn-lg w-100 auth-btn mb-3">
            Sign In
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-bold auth-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;