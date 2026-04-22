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
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
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

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setCursorPos({ x, y });
  };

  if (showWelcome) {
    return <WelcomeScreen username={loggedInUser.username} onComplete={finalizeLogin} />;
  }

  return (
    <div 
      className="auth-fullscreen" 
      onMouseMove={handleMouseMove}
      style={{ '--cursor-x': `${cursorPos.x}%`, '--cursor-y': `${cursorPos.y}%` }}
    >
      {/* 🎬 Sequential Splash Screen */}
      {showSplash ? (
        <div className="splash-overlay">
          <img src="/hero_intro.png" alt="BloodLink" className="splash-logo" />
          <h1 className="splash-text">Life is Precious</h1>
        </div>
      ) : (
        <div className="login-entrance w-100" style={{ background: "transparent", minHeight: "100vh" }}>
          
          {/* 🌊 Hero Section */}
          <section className="liquid-hero">
            {/* 🌌 Unique Glowing Background Reacting to Cursor */}
            <div className="auth-bg-glow" />
            <div className="auth-glow-blob cursor-blob" style={{ transform: 'translate(calc(var(--cursor-x, 50) * 1vw - 20vh), calc(var(--cursor-y, 50) * 1vh - 20vh))', left: 0, top: 0, width: '40vh', height: '40vh' }} />
            <div className="auth-glow-blob" style={{ bottom: '10%', right: '5%', animationDelay: '-10s' }} />

            {/* Floating Anti-Gravity Blood Cells */}
            <div className="blood-cell-flow float-cell" style={{ '--top': '20vh', '--duration': '15s', animationDelay: 'calc(var(--cursor-x, 50) * -0.05s)' }}></div>
            <div className="blood-cell-flow float-cell" style={{ '--top': '40vh', '--duration': '20s', animationDelay: 'calc(var(--cursor-y, 50) * -0.05s)', opacity: 0.4 }}></div>
            <div className="blood-cell-flow float-cell" style={{ '--top': '60vh', '--duration': '12s', animationDelay: '5s' }}></div>
            <div className="blood-cell-flow float-cell" style={{ '--top': '80vh', '--duration': '18s', animationDelay: '1s', opacity: 0.5 }}></div>

            <div className="liquid-navbar">
               <div className="fs-3 fw-bold text-white d-flex align-items-center">
                 <span className="me-2 fs-2">❤️</span> BloodLink
               </div>
               <div className="liquid-nav-links d-none d-md-flex align-items-center">
                 <a href="#about" style={{ textDecoration: 'none' }}>About</a>
                 <a href="#impact" style={{ textDecoration: 'none' }}>Impact</a>
                 <Link to="/register" className="btn btn-sm btn-outline-light rounded-pill px-4 ms-3" style={{ textDecoration: 'none' }}>Sign Up</Link>
                 <button onClick={() => setShowLoginForm(true)} className="btn btn-sm btn-light rounded-pill px-4 text-dark fw-bold ms-3" style={{ textDecoration: 'none' }}>Login</button>
               </div>
            </div>

            {showLoginForm ? (
              <div className="z-10 px-3 page-enter" style={{ marginTop: '-5vh', width: '100%', maxWidth: '440px' }}>
                <div className="glass-card auth-card p-5 w-100 position-relative">
                  <button onClick={() => setShowLoginForm(false)} className="btn btn-sm text-white-50 position-absolute" style={{ top: '15px', right: '15px', fontSize: '1.2rem', background: 'transparent', border: 'none' }}>✕</button>
                  <div className="text-center mb-4">
                    <div className="auth-icon mb-2" style={{ fontSize: '2.5rem' }}>🔐</div>
                    <h2 className="fw-bold text-white" style={{ fontSize: "1.8rem", letterSpacing: '-0.5px' }}>
                      Welcome Back
                    </h2>
                    <p className="text-muted small opacity-75">Securely access your account to manage donations.</p>
                  </div>

                  {error && <div className="alert alert-danger py-2 rounded-3 border-0 bg-danger bg-opacity-10 text-danger small">{error}</div>}

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

                    <button type="submit" className="btn btn-lg w-100 auth-btn mb-4 rounded-pill fw-bold" style={{ background: '#ef4444' }}>
                      Sign In
                    </button>

                    <div className="d-flex align-items-center mb-4">
                      <hr className="flex-grow-1 opacity-25" />
                      <span className="px-3 text-muted small text-uppercase">Or continue with</span>
                      <hr className="flex-grow-1 opacity-25" />
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <button type="button" className="btn w-100 py-2 glass-card d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                           <span className="me-2">G</span> Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="button" className="btn w-100 py-2 glass-card d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                           <span className="me-2">git</span> GitHub
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-muted small mb-0">
                      New to BloodLink?{" "}
                      <Link to="/register" className="text-decoration-none fw-bold text-white">
                        Join the Network
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center z-10 px-3 page-enter" style={{ marginTop: '-15vh' }}>
                  <h1 className="display-2 fw-bold text-white mb-3" style={{ letterSpacing: '-1.5px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    Elevate Your<br/>Lifesaving Impact
                  </h1>
                  <p className="text-white opacity-75 mb-5 fs-5 mx-auto" style={{ maxWidth: '600px' }}>
                    Unlock your donation potential in a fully connected network, powered by BloodLink.
                  </p>
                  <button onClick={() => setShowLoginForm(true)} className="btn btn-hero-huge btn-light rounded-pill fw-bold shadow-lg">
                    Sign In & Save Lives
                  </button>
                </div>

                <div className="floating-glass-card d-none d-lg-block page-enter" style={{ left: '10%', top: '55%' }}>
                  <div className="text-white-50 small mb-1 text-uppercase fw-bold">Lives Saved</div>
                  <div className="fw-bold fs-4 d-flex align-items-center">
                    2.5k+ <span className="ms-3 text-success fs-6 px-2 py-1 rounded-pill" style={{ background: 'rgba(25, 135, 84, 0.2)' }}>↗ 12%</span>
                  </div>
                </div>

                <div className="floating-glass-card d-none d-lg-block page-enter" style={{ right: '10%', top: '65%', animationDelay: '1s' }}>
                  <div className="text-white-50 small mb-1 text-uppercase fw-bold">Demand Met</div>
                  <div className="fw-bold fs-3">
                    96% 
                  </div>
                  <div className="mt-2 rounded-pill overflow-hidden" style={{height:'4px', width:'150px', background:'rgba(255,255,255,0.2)'}}>
                     <div style={{width:'96%', height:'100%', background:'#fff'}}></div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* 🌟 Importance & Impact Section */}
          <section id="about" className="container py-5 my-5">
             <div className="text-center mb-5 reveal-on-scroll">
               <span className="badge px-3 py-2 rounded-pill mb-3 fw-bold" style={{ background: 'rgba(124, 45, 150, 0.2)', color: '#d8b4e2' }}>THE IMPORTANCE</span>
               <h2 className="display-4 fw-bold text-white mb-4" style={{ letterSpacing: '-1px' }}>The Power of a Single Drop</h2>
               <p className="text-white-50 fs-5 mx-auto" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
                 Every drop of blood carries the power to save a life. Join a growing community of donors and heroes making a real difference every day. BloodLink connects donors, hospitals, and patients in real time—ensuring help reaches where it’s needed most. Whether it’s an emergency or a planned donation, your contribution matters. Track your impact, respond to urgent requests, and be part of a lifesaving network. Together, we can bridge the gap between need and hope. Step forward, donate blood, and become someone’s reason to live today.
               </p>
             </div>

             <div className="row g-5 align-items-center mt-4">
               <div className="col-lg-6 reveal-on-scroll">
                  <div className="glass-card p-5 border-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
                     <h3 className="fw-bold text-white mb-4">Why Donate Blood?</h3>
                     <div className="d-flex mb-4">
                       <div className="fs-1 me-4">🩸</div>
                       <div>
                         <h5 className="text-white fw-bold">1 Donation = 3 Lives</h5>
                         <p className="text-white-50 small">Blood can be separated into red cells, platelets, and plasma, saving up to three different patients.</p>
                       </div>
                     </div>
                     <div className="d-flex mb-4">
                       <div className="fs-1 me-4">⏱️</div>
                       <div>
                         <h5 className="text-white fw-bold">Every 2 Seconds</h5>
                         <p className="text-white-50 small">Someone in the world needs a blood transfusion for surgeries, accidents, or chronic illnesses.</p>
                       </div>
                     </div>
                     <div className="d-flex">
                       <div className="fs-1 me-4">❤️</div>
                       <div>
                         <h5 className="text-white fw-bold">Health Benefits</h5>
                         <p className="text-white-50 small">Regular donation improves cardiovascular health and stimulates fresh blood cell production.</p>
                       </div>
                     </div>
                  </div>
               </div>
               
               <div id="impact" className="col-lg-6 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                  <h3 className="fw-bold text-white mb-4">The Global Need</h3>
                  <p className="text-white-50 fs-5 lh-lg mb-4">
                    Despite the critical need, only about <strong>3%</strong> of age-eligible people donate blood yearly. Blood cannot be manufactured; it can only come from generous donors like you.
                  </p>
                  <div className="row g-4 text-center">
                    <div className="col-6">
                      <div className="glass-card p-4 border-0 h-100" style={{ background: 'rgba(220, 38, 38, 0.05)' }}>
                         <h2 className="text-danger fw-bold mb-0">38k</h2>
                         <p className="text-white-50 small mt-2 mb-0">Units needed daily</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card p-4 border-0 h-100" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                         <h2 className="text-primary fw-bold mb-0">42 Days</h2>
                         <p className="text-white-50 small mt-2 mb-0">Shelf life of red cells</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card p-4 border-0 h-100" style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
                         <h2 className="text-warning fw-bold mb-0">O-</h2>
                         <p className="text-white-50 small mt-2 mb-0">Universal donor type</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="glass-card p-4 border-0 h-100" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                         <h2 className="text-success fw-bold mb-0">15 Min</h2>
                         <p className="text-white-50 small mt-2 mb-0">Time to save a life</p>
                      </div>
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
                  <h1 className="fw-bold mb-1" style={{ color: '#d8b4e2' }}>500+</h1>
                  <p className="text-white-50 text-uppercase small fw-bold">Verified Donors</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">120+</h1>
                  <p className="text-white-50 text-uppercase small fw-bold">Partner Hospitals</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">2.5k</h1>
                  <p className="text-white-50 text-uppercase small fw-bold">Lives Impacted</p>
                </div>
                <div className="col-md-3">
                  <h1 className="fw-bold text-white mb-1">100%</h1>
                  <p className="text-white-50 text-uppercase small fw-bold">Safe & Secure</p>
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