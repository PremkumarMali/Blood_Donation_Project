import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-glass mt-auto py-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand & Mission */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold mb-3" style={{color: '#ef4444'}}>❤️ BloodLink</h4>
            <p className="text-muted pe-lg-4">
              Building a bridge between life-savers and those in need. Our platform leverages 
              modern technology to make blood donation faster, easier, and more transparent.
            </p>
            <div className="mt-4">
              <h6 className="fw-bold small text-uppercase mb-3">Why we build this?</h6>
              <p className="text-muted small">
                Every second, someone needs blood. We believe no life should be lost due to 
                lack of access to safe blood. Our mission is to digitize the life-saving 
                process of blood donation.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase mb-4">Navigation</h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2"><Link to="/user" className="text-decoration-none">Dashboard</Link></li>
              <li className="mb-2"><Link to="/user/find-donor" className="text-decoration-none">Find Donor</Link></li>
              <li className="mb-2"><Link to="/user/donate-blood" className="text-decoration-none">Donate Blood</Link></li>
              <li className="mb-2"><Link to="/user/profile" className="text-decoration-none">My Profile</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase mb-4">Contact Us</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-3 d-flex align-items-center">
                <span className="me-2">📧</span>
                <span>contact@bloodlink.org</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <span className="me-2">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <span className="me-2">📍</span>
                <span>123 Life Street, Wellness City, India</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase mb-4">Connect With Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="social-icon-btn">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon-btn">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon-btn">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon-btn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-muted small">
                Stay updated with our latest drives and emergency requests.
              </p>
            </div>
          </div>
        </div>

        <hr className="my-5" style={{borderColor: 'var(--glass-border)'}} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <p className="mb-0">© 2026 BloodLink Organization. All rights reserved.</p>
          <div className="d-flex gap-4 mt-3 mt-md-0">
            <a href="#" className="text-decoration-none text-muted">Privacy Policy</a>
            <a href="#" className="text-decoration-none text-muted">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
