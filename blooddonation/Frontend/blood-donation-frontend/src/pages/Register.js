import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DonationAwareness from "../components/DonationAwareness";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    location: "",
    hospitalName: "",
    bankName: "",
    license: "",
    bloodGroup: ""
  });

  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

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
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.unobserve(el));
    };
  }, [showSplash]);

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/register", formData);
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Registration failed.";
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  return (
    <div 
      className="auth-fullscreen"
      onMouseMove={handleMouseMove}
      style={{ '--cursor-x': `${cursorPos.x}px`, '--cursor-y': `${cursorPos.y}px` }}
    >
      {/* 🎬 Sequential Splash Screen */}
      {showSplash && (
        <div className="splash-overlay">
          <img src="/bloodlink_logo.png" alt="BloodLink" className="splash-logo" />
          <h1 className="splash-text">Saving Lives</h1>
        </div>
      )}

      <div className={`login-entrance w-100 ${showSplash ? 'd-none' : ''}`} style={{ background: "transparent", minHeight: "100vh" }}>
        
        {/* 🚀 Hero Section - Matching Login UI */}
        <section className="liquid-hero" style={{ paddingBottom: '5rem' }}>
          {/* 🌌 Background Elements */}
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
              <Link to="/login" className="nav-link">About</Link>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn btn-sm btn-primary rounded-pill px-4 ms-2">Sign Up</Link>
            </div>
          </nav>

          <div className="container-fluid position-relative z-10 d-flex flex-column align-items-center justify-content-center py-5 mt-5">
            <div className="glass-card auth-card page-enter p-4 p-md-5" style={{ maxWidth: '600px', width: '100%' }}>
              <div className="text-center mb-4">
                <div className="auth-icon">🩸</div>
                <h2 className="text-premium mt-3" style={{ fontSize: "2rem", letterSpacing: '-1px' }}>Join the Network</h2>
                <p className="text-stylish small">Become a part of the life-saving chain.</p>
              </div>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input className="form-control auth-input" name="username" placeholder="Username" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control auth-input" name="email" placeholder="Email" type="email" onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <input className="form-control auth-input" name="password" placeholder="Password" type="password" onChange={handleChange} required />
                  </div>

                  <div className="col-12">
                    <select className="form-select auth-input" name="role" onChange={handleChange} required>
                      <option value="">Register As...</option>
                      <option value="USER">Donor / Recipient</option>
                      <option value="HOSPITAL">Hospital Partner</option>
                      <option value="ADMIN">Blood Bank Manager</option>
                    </select>
                  </div>

                  {formData.role === "USER" && (
                    <>
                      <div className="col-md-6">
                        <input className="form-control auth-input" name="phone" placeholder="Contact Number" onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <select className="form-select auth-input" name="bloodGroup" onChange={handleChange} required>
                          <option value="">Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </>
                  )}

                  {formData.role === "HOSPITAL" && (
                    <>
                      <div className="col-12">
                        <input className="form-control auth-input" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control auth-input" name="location" placeholder="City/Location" onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control auth-input" name="phone" placeholder="Hospital Contact" onChange={handleChange} />
                      </div>
                    </>
                  )}

                  {formData.role === "ADMIN" && (
                    <>
                      <div className="col-12">
                        <input className="form-control auth-input" name="bankName" placeholder="Blood Bank Name" onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control auth-input" name="license" placeholder="License Number" onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control auth-input" name="location" placeholder="City/Location" onChange={handleChange} />
                      </div>
                      <div className="col-12">
                        <input className="form-control auth-input" name="phone" placeholder="Bank Contact" onChange={handleChange} />
                      </div>
                    </>
                  )}
                </div>

                <button type="submit" className="btn w-100 auth-btn mt-4 fw-bold">
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-stylish small mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="fw-bold text-danger">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ✨ Info Section - Clean & Aligned */}
        <section className="container py-5 my-5">
          <div className="row reveal-on-scroll align-items-center g-5">
             <div className="col-lg-6">
               <div className="position-relative">
                 <div className="glass-card p-2 border-0 shadow-lg" style={{ borderRadius: '32px' }}>
                   <img src="/story_donation.png" alt="Join the cause" className="img-fluid" style={{ borderRadius: '24px', width: '100%' }} />
                 </div>
                 <div className="floating-glass-card d-none d-md-block" style={{ top: '-20px', right: '-20px', padding: '1rem' }}>
                    <div className="text-danger fw-bold fs-5">Verified</div>
                 </div>
               </div>
            </div>
            <div className="col-lg-6 text-start">
              <span className="badge px-3 py-2 rounded-pill mb-3 fw-bold" style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(230, 57, 70, 0.2)'}}>OUR NETWORK</span>
              <h2 className="text-premium display-4 mb-4">Why Join <span style={{color: 'var(--accent-color)'}}>BloodLink?</span></h2>
              <p className="text-stylish fs-5 mb-5">
                We are more than just a registry. We are a community of life-savers working together 
                to ensure safe blood is available whenever and wherever it's needed.
              </p>
              <div className="row g-4">
                  <div className="col-md-6">
                      <div className="glass-card p-4 border-0 h-100">
                          <h5 className="text-premium mb-2">🛡️ Trusted Heroes</h5>
                          <p className="small text-stylish mb-0">Hospitals & donors are 100% verified for safety and reliability.</p>
                      </div>
                  </div>
                   <div className="col-md-6">
                      <div className="glass-card p-4 border-0 h-100">
                          <h5 className="text-premium mb-2">⚡ Real-time Alerts</h5>
                          <p className="small text-stylish mb-0">Instant notifications for emergency blood needs in your area.</p>
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

export default Register;