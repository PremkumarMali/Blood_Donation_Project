import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";
import DonationAwareness from "../components/DonationAwareness";
import Footer from "../components/Footer";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Slightly longer for full animation effect

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    if (!showSplash) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [showSplash]);

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
      {/* 🎬 Sequential Splash Screen */}
      {showSplash ? (
        <div className="splash-overlay">
          <img src="/hero_intro.png" alt="BloodLink" className="splash-logo" />
          <h1 className="splash-text">Life is Precious</h1>
        </div>
      ) : (
        <div className="login-entrance w-100">
          {/* 🌌 Background */}
          <div className="auth-bg-glow" />
          <div className="auth-glow-blob" style={{ top: '10%', left: '5%' }} />
          <div className="auth-glow-blob" style={{ bottom: '10%', right: '5%', animationDelay: '-10s' }} />

          {/* 🚀 Main Content */}
          <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
            <DonationAwareness />
            
            <div className="glass-card auth-card page-enter p-5">
              <div className="text-center mb-4">
                <div className="auth-icon">❤️</div>
                <h2 className="fw-bold mt-3 text-white" style={{ fontSize: "2.2rem", letterSpacing: '-1px' }}>
                  Welcome Back
                </h2>
                <p className="text-muted opacity-75">Securely access your account to manage donations.</p>
              </div>

              {error && <div className="alert alert-danger py-2 rounded-3 border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg auth-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Login As</label>
                  <select
                    className="form-select form-select-lg auth-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">Donor / Recipient</option>
                    <option value="HOSPITAL">Hospital Partner</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-lg w-100 auth-btn mb-3">
                  Sign In
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="text-muted small mb-0">
                  New to BloodLink?{" "}
                  <Link to="/register" className="text-decoration-none fw-bold auth-link">
                    Join the Network
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ✨ Stories */}
          <section className="container py-5 mt-5">
            <div className="row reveal-on-scroll align-items-center mb-5 pb-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <img src="/story_donation.png" alt="Giving Life" className="story-image" />
              </div>
              <div className="col-lg-6 ps-lg-5">
                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill mb-3 fw-bold">OUR STORY</span>
                <h2 className="fw-bold text-white display-5 mb-4">Every Donor is a <span className="text-danger">Superhero</span></h2>
                <p className="text-muted fs-5">
                  We started BloodLink with a simple goal: to ensure that no patient ever has to wait for 
                  blood in an emergency. By connecting donors directly with hospitals, we reduce response 
                  time from hours to minutes.
                </p>
                <div className="mt-4 d-flex gap-3">
                  <div className="glass-card p-3 flex-grow-1 border-0">
                    <h3 className="fw-bold text-white mb-0">15m</h3>
                    <p className="small text-muted mb-0">Average Connection Time</p>
                  </div>
                  <div className="glass-card p-3 flex-grow-1 border-0">
                    <h3 className="fw-bold text-white mb-0">24/7</h3>
                    <p className="small text-muted mb-0">Emergency Support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row reveal-on-scroll align-items-center flex-column-reverse flex-lg-row">
              <div className="col-lg-6 pe-lg-5">
                <h2 className="fw-bold text-white display-5 mb-4">Real-time tracking for <span className="text-primary">Reliability</span></h2>
                <p className="text-muted fs-5">
                  Our advanced inventory management system allows hospitals to broadcast their needs 
                  instantly. Donors receive live updates and can track their impact in real-time through 
                  their personal dashboard.
                </p>
                <Link to="/register" className="btn btn-outline-danger rounded-pill px-5 py-3 fw-bold mt-4">
                  Get Started Today
                </Link>
              </div>
              <div className="col-lg-6 mb-4 mb-lg-0">
                 <div className="glass-card p-4 border-0">
                    <div className="row g-4">
                        <div className="col-6"><div className="feature-icon-box mx-auto">📊</div><p className="text-center small text-white fw-bold">Live Inventory</p></div>
                        <div className="col-6"><div className="feature-icon-box mx-auto">🚨</div><p className="text-center small text-white fw-bold">Emergency SOS</p></div>
                        <div className="col-6"><div className="feature-icon-box mx-auto">🏆</div><p className="text-center small text-white fw-bold">Reward Points</p></div>
                        <div className="col-6"><div className="feature-icon-box mx-auto">🛡️</div><p className="text-center small text-white fw-bold">Secure Data</p></div>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* 📈 Stats */}
          <section className="container-fluid py-5 my-5" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <div className="container">
              <div className="row text-center g-4 reveal-on-scroll">
                <div className="col-md-3">
                  <h1 className="fw-bold text-danger mb-1">500+</h1>
                  <p className="text-muted text-uppercase small fw-bold">Verified Donors</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">120+</h1>
                  <p className="text-muted text-uppercase small fw-bold">Partner Hospitals</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">2.5k</h1>
                  <p className="text-muted text-uppercase small fw-bold">Lives Impacted</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">100%</h1>
                  <p className="text-muted text-uppercase small fw-bold">Safe & Secure</p>
                </div>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Login;