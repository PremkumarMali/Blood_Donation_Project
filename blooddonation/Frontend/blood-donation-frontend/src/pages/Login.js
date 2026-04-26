import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";
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
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Splash screen and scroll animation observer
  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2800);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    // Only observe after splash is gone
    if (!showSplash) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    
    return () => {
      clearTimeout(splashTimer);
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.unobserve(el));
    };
  }, [showSplash]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/login", { username, password, role });
      if (response.data && response.data.role) {
        setLoggedInUser(response.data);
        setShowWelcome(true);
      } else {
        setError("Invalid credentials or role.");
      }
    } catch (err) {
      console.error("Login error detail:", err);
      const msg = err.response?.data?.message || err.response?.data || "Login failed. Please check your connection.";
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  const finalizeLogin = () => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    if (loggedInUser.role === "ADMIN") navigate("/admin");
    else if (loggedInUser.role === "HOSPITAL") navigate("/hospital");
    else navigate("/user");
  };

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  if (showWelcome) {
    return <WelcomeScreen username={loggedInUser.username} onComplete={finalizeLogin} />;
  }

  return (
    <div 
      className="auth-fullscreen" 
      onMouseMove={handleMouseMove}
      style={{ '--cursor-x': `${cursorPos.x}px`, '--cursor-y': `${cursorPos.y}px` }}
    >
      {showSplash && (
        <div className="splash-overlay">
          <img src="/bloodlink_logo.png" alt="BloodLink Logo" className="splash-logo" />
          <h1 className="splash-text">Life is Precious</h1>
        </div>
      )}

      <div className={`login-entrance w-100 ${showSplash ? 'd-none' : ''}`} style={{ background: "transparent", minHeight: "100vh" }}>
        
        <section className="liquid-hero">
          <div className="auth-bg-glow" />
          <div className="auth-glow-blob cursor-blob" style={{ transform: `translate(calc(var(--cursor-x, 50vw) - 20vw), calc(var(--cursor-y, 50vh) - 20vw))`, width: '40vw', height: '40vw' }} />
          <div className="auth-glow-blob" style={{ bottom: '10%', right: '5%', animationDelay: '-10s' }} />

          <div className="blood-cell-flow" style={{ '--top': '20vh', '--duration': '15s' }}></div>
          <div className="blood-cell-flow" style={{ '--top': '40vh', '--duration': '20s', opacity: 0.4 }}></div>
          <div className="blood-cell-flow" style={{ '--top': '70vh', '--duration': '12s' }}></div>

          <nav className="liquid-navbar">
            <div className="fs-3 fw-bold d-flex align-items-center">
              <span className="brand-animated-bg">❤️ BloodLink</span>
            </div>
            <div className="liquid-nav-links d-none d-md-flex align-items-center">
              <a href="#about" className="nav-link">About</a>
              <button onClick={() => setShowLoginForm(true)} className="nav-link bg-transparent border-0 fw-bold">Sign In</button>
              <Link to="/register" className="btn btn-sm btn-primary rounded-pill px-4 ms-2">Sign Up</Link>
            </div>
          </nav>

          {showLoginForm ? (
            <div className="z-10 px-3 page-enter" style={{ width: '100%', maxWidth: '520px' }}>
              <div className="glass-card auth-card p-4 p-md-5 w-100 position-relative">
                <button onClick={() => setShowLoginForm(false)} className="btn-close position-absolute" style={{ top: '20px', right: '20px' }}></button>
                <div className="text-center mb-4">
                  <div className="auth-icon mb-2">🔐</div>
                  <h2 className="text-premium fs-2">Welcome Back</h2>
                  <p className="text-stylish small">Securely access your account.</p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label small text-uppercase fw-semibold opacity-75">Username</label>
                    <input type="text" className="form-control auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-uppercase fw-semibold opacity-75">Password</label>
                    <input type="password" className="form-control auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-uppercase fw-semibold opacity-75">Login As</label>
                    <select className="form-select auth-input" value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="USER">Donor / Recipient</option>
                      <option value="HOSPITAL">Hospital</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn w-100 auth-btn fw-bold">Sign In</button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-stylish small mb-0">
                    New to BloodLink?{" "}
                    <Link to="/register" className="fw-bold text-danger">Join Now</Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center z-10 px-3 page-enter">
                <h1 className="display-2 fw-bolder mb-3 text-premium" style={{ letterSpacing: '-2px' }}>
                  A Single Drop,
                  <br/> A Lifelong <span style={{color: "var(--accent-color)"}}>Impact</span>.
                </h1>
                <p className="text-stylish mb-5 fs-5 mx-auto" style={{ maxWidth: '600px' }}>
                  Connect with a network of heroes. Your donation is a lifeline.
                </p>
                <button onClick={() => setShowLoginForm(true)} className="btn-primary btn-lg shadow-lg px-5 py-3 rounded-pill">
                  Sign In & Save Lives
                </button>
              </div>

              <div className="floating-glass-card d-none d-lg-block page-enter" style={{ left: '10%', top: '55%' }}>
                <div className="text-muted small mb-1 text-uppercase fw-bold">Lives Saved</div>
                <div className="fw-bold fs-4 d-flex align-items-center text-danger">2,500+</div>
              </div>

              <div className="floating-glass-card d-none d-lg-block page-enter" style={{ right: '10%', top: '65%', animationDelay: '0.5s' }}>
                <div className="text-muted small mb-1 text-uppercase fw-bold">Demand Met</div>
                <div className="fw-bold fs-3 text-danger">96%</div>
              </div>
            </>
          )}
        </section>

        <section id="about" className="container py-5 my-5">
           <div className="text-center mb-5 reveal-on-scroll">
             <span className="badge px-3 py-2 rounded-pill mb-3 fw-bold" style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(230, 57, 70, 0.2)'}}>THE MISSION</span>
             <h2 className="display-4 text-premium mb-3">The Power of a Single Donation</h2>
             <p className="text-stylish fs-5 mx-auto" style={{ maxWidth: '750px', lineHeight: '1.7' }}>
               Every two seconds, someone needs blood. BloodLink is the digital bridge between compassionate donors, hospitals, and patients, ensuring that help arrives when it matters most.
             </p>
           </div>

           <div className="row g-4 align-items-center mt-4">
             <div className="col-lg-6 reveal-on-scroll">
                <div className="glass-card p-4 p-md-5 h-100">
                   <h3 className="text-premium mb-4">Why Your Donation Matters</h3>
                   <div className="d-flex align-items-start mb-4">
                     <div className="fs-2 me-4">🩸</div>
                     <div>
                       <h5 className="text-premium fw-semibold">One Donation Saves Three Lives</h5>
                       <p className="text-stylish small">Your blood is separated into red cells, platelets, and plasma to help multiple patients.</p>
                     </div>
                   </div>
                   <div className="d-flex align-items-start">
                     <div className="fs-2 me-4">❤️</div>
                     <div>
                       <h5 className="text-premium fw-semibold">It's a Gift to Yourself</h5>
                       <p className="text-stylish small">Regular donation can improve cardiovascular health and gives you a free health screening.</p>
                     </div>
                   </div>
                </div>
             </div>
             
             <div id="impact" className="col-lg-6 reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                <div className="row g-4">
                   <div className="col-6">
                    <div className="glass-card p-4 text-center h-100" style={{ background: 'rgba(230, 57, 70, 0.05)' }}>
                       <h2 className="text-premium fw-bolder mb-1" style={{ color: 'var(--accent-color)'}}>38k</h2>
                       <p className="text-stylish small mt-1 mb-0">Units Needed Daily</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="glass-card p-4 text-center h-100" style={{ background: 'rgba(45, 36, 30, 0.05)' }}>
                       <h2 className="text-premium fw-bolder mb-1">42 Days</h2>
                       <p className="text-stylish small mt-1 mb-0">Shelf Life of Blood</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="glass-card p-4 text-center" style={{ background: 'rgba(230, 57, 70, 0.03)' }}>
                       <h2 className="text-premium fw-bolder mb-1" style={{ color: 'var(--accent-color)'}}>15 Mins</h2>
                       <p className="text-stylish small mt-1 mb-0">The time it takes to become a hero.</p>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}

export default Login;