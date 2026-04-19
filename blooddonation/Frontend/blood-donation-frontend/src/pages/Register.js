import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import DonationAwareness from "../components/DonationAwareness";

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
      <DonationAwareness />

      <div className="glass-card auth-card page-enter p-5" style={{ maxWidth: "480px", marginLeft: "auto", marginRight: "10%" }}>
        <div className="text-center mb-4">
          <div className="auth-icon">🩸</div>
          <h2 className="fw-bold mt-3" style={{ fontSize: "1.8rem" }}>Join Our Community</h2>
          <p className="text-muted">Register to start saving lives</p>
        </div>

        {error && <div className="alert alert-danger py-2 rounded-3">{error}</div>}

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

          <div className="mb-3">
            <select className="form-select form-select-lg auth-input" name="role" onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="USER">User / Donor</option>
              <option value="HOSPITAL">Hospital</option>
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
                <input className="form-control form-control-lg auth-input" name="location" placeholder="Location" onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input className="form-control form-control-lg auth-input" name="contact" placeholder="Contact" onChange={handleChange} />
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
                <input className="form-control form-control-lg auth-input" name="location" placeholder="Location" onChange={handleChange} />
              </div>
              <div className="mb-3">
                <input className="form-control form-control-lg auth-input" name="contact" placeholder="Contact" onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-lg w-100 auth-btn mb-3">
            Register Now
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-muted small mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-bold auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;