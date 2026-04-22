import { useState, useEffect } from "react";
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
    contact: "",
    location: "",
    hospitalName: "",
    bankName: "",
    license: ""
  });

  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(true);

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
      observer.disconnect();
    };
  }, [showSplash]);

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
    <div className="auth-fullscreen">
      {/* 🎬 Sequential Splash Screen */}
      {showSplash ? (
        <div className="splash-overlay">
          <img src="/hero_intro.png" alt="BloodLink" className="splash-logo" />
          <h1 className="splash-text">Saving Lives</h1>
        </div>
      ) : (
        <div className="login-entrance w-100">
          {/* 🌌 Background */}
          <div className="auth-bg-glow" />
          <div className="auth-glow-blob" style={{ top: '15%', right: '10%' }} />
          <div className="auth-glow-blob" style={{ bottom: '20%', left: '5%', animationDelay: '-12s' }} />

          {/* 🚀 Hero Section */}
          <div className="container-fluid min-vh-100 position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center py-5">
            <DonationAwareness />

            <div className="glass-card auth-card page-enter p-5">
              <div className="text-center mb-4">
                <div className="auth-icon">🩸</div>
                <h2 className="fw-bold mt-3 text-white" style={{ fontSize: "2rem", letterSpacing: '-1px' }}>Join the Network</h2>
                <p className="text-muted opacity-75">Become a part of the life-saving chain.</p>
              </div>

              {error && <div className="alert alert-danger py-2 rounded-3 border-0 bg-danger bg-opacity-10 text-danger">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <input className="form-control form-control-lg auth-input" name="username" placeholder="Username" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input className="form-control form-control-lg auth-input" name="email" placeholder="Email" type="email" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input className="form-control form-control-lg auth-input" name="password" placeholder="Password" type="password" onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <select className="form-select form-select-lg auth-input" name="role" onChange={handleChange} required>
                    <option value="">Register As...</option>
                    <option value="USER">Donor / Recipient</option>
                    <option value="HOSPITAL">Hospital Partner</option>
                    <option value="ADMIN">Blood Bank Manager</option>
                  </select>
                </div>

                {formData.role === "USER" && (
                  <div className="mb-3">
                    <input className="form-control form-control-lg auth-input" name="contact" placeholder="Contact Number" onChange={handleChange} />
                  </div>
                )}

                {formData.role === "HOSPITAL" && (
                  <>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="location" placeholder="City/Location" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="contact" placeholder="Hospital Contact" onChange={handleChange} />
                    </div>
                  </>
                )}

                {formData.role === "ADMIN" && (
                  <>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="bankName" placeholder="Blood Bank Name" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="license" placeholder="License Number" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="location" placeholder="City/Location" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <input className="form-control form-control-lg auth-input" name="contact" placeholder="Bank Contact" onChange={handleChange} />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-lg w-100 auth-btn mt-4">
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-bold auth-link">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ✨ Info Section */}
          <section className="container py-5 mt-5">
            <div className="row reveal-on-scroll align-items-center mb-5">
               <div className="col-lg-6 mb-4 mb-lg-0">
                <img src="/story_donation.png" alt="Join the cause" className="story-image" />
              </div>
              <div className="col-lg-6 ps-lg-5 text-start">
                <h2 className="fw-bold text-white display-5">Why Join <span className="text-danger">BloodLink?</span></h2>
                <p className="text-muted fs-5 mt-4">
                  We are more than just a registry. We are a community of life-savers working together 
                  to ensure safe blood is available whenever and wherever it's needed.
                </p>
                <div className="mt-4 row g-3">
                    <div className="col-md-6">
                        <div className="glass-card p-3 border-0">
                            <h6 className="text-white fw-bold mb-1">🛡️ Verified</h6>
                            <p className="small text-muted mb-0">Hospitals & donors are 100% verified.</p>
                        </div>
                    </div>
                     <div className="col-md-6">
                        <div className="glass-card p-3 border-0">
                            <h6 className="text-white fw-bold mb-1">⚡ Instant</h6>
                            <p className="small text-muted mb-0">Real-time emergency notifications.</p>
                        </div>
                    </div>
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

export default Register;