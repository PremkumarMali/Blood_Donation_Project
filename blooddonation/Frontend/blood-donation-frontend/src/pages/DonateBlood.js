import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DonateBlood = () => {
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    bloodType: "",
    locationId: "",
    locationName: "",
    donationDate: "",
    timeSlot: "",
    collectionType: "HOSPITAL",
    collectionAddress: "",
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
      fetchAppointments(loggedUser.user_id);
    }
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/donations/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations", err);
    }
  };

  const fetchAppointments = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/donations/user/${userId}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "location") {
      const loc = locations.find(l => l.id == e.target.value);
      if (loc) {
        setFormData({ ...formData, locationId: loc.id, locationName: loc.name });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      userId: user.user_id,
      userName: user.username,
    };

    try {
      await axios.post("http://localhost:8080/api/donations/book", data);
      toast.success("Donation appointment booked successfully!");
      setFormData({
        bloodType: "",
        locationId: "",
        locationName: "",
        donationDate: "",
        timeSlot: "",
        collectionType: "HOSPITAL",
        collectionAddress: "",
      });
      fetchAppointments(user.user_id);
    } catch (err) {
      toast.error("Failed to book appointment.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* 🩸 Hero Banner */}
      <div className="donor-hero-section mb-5" style={{ padding: '2.5rem' }}>
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="position-relative" style={{ zIndex: 2 }}>
          <span className="badge hero-tag mb-3">🩸 GIVE THE GIFT OF LIFE</span>
          <h1 className="hero-headline" style={{ fontSize: '2.5rem' }}>
            Donate Blood, <span className="hero-highlight">Save Lives</span>
          </h1>
          <p className="hero-subtitle mt-2">
            Your single donation can save up to 3 lives. Schedule your appointment 
            at a nearby blood bank or hospital and make a difference today.
          </p>
        </div>
      </div>
      
      {/* 📝 Booking Form */}
      <div className="dark-widget mb-5">
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.5rem' }}>❤️</div>
          <h3 className="fw-bold text-white mt-2">Schedule Your Donation</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Fill in the details to book your appointment.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Type</label>
            <select
              className="form-select dark-widget-input"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Type</option>
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

          <div className="col-md-6">
            <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Location</label>
            <select
              className="form-select dark-widget-input"
              name="location"
              value={formData.locationId}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Donation Date</label>
            <input
              type="date"
              className="form-control dark-widget-input"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Time Slot</label>
            <select
              className="form-select dark-widget-input"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select Slot</option>
              <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
              <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Collection Type</label>
            <select
              className="form-select dark-widget-input"
              name="collectionType"
              value={formData.collectionType}
              onChange={handleChange}
              required
            >
              <option value="HOSPITAL">Visit Hospital / Blood Bank</option>
              <option value="HOME">Home Collection (Collect from my location)</option>
            </select>
          </div>

          {formData.collectionType === "HOME" && (
            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Collection Address</label>
              <textarea
                className="form-control dark-widget-input"
                name="collectionAddress"
                value={formData.collectionAddress}
                onChange={handleChange}
                placeholder="Enter your full address for blood collection"
                required={formData.collectionType === "HOME"}
                rows="2"
              ></textarea>
            </div>
          )}

          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-danger btn-lg px-5 fw-bold shadow" style={{ borderRadius: '14px' }}>
              🩸 Book Appointment
            </button>
          </div>
        </form>
      </div>

      {/* 📋 Appointments Table */}
      <div className="dark-widget mb-5">
        <h4 className="mb-4 fw-bold text-white">📋 My Donation Appointments</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle dark-widget-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td><span className="badge bg-danger">{app.bloodType}</span></td>
                  <td>{app.locationName}</td>
                  <td>{app.donationDate}</td>
                  <td>{app.timeSlot}</td>
                  <td>
                    <span className={`badge ${app.collectionType === 'HOME' ? 'bg-info' : 'bg-secondary'}`}>
                      {app.collectionType === 'HOME' ? '🏠 Home' : '🏥 Hospital'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${
                      app.status === 'PENDING' ? 'bg-warning text-dark' : 
                      app.status === 'APPROVED' ? 'bg-primary' : 
                      app.status === 'COMPLETED' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4" style={{ color: 'rgba(255,255,255,0.4)' }}>No appointments found. Start by booking one above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonateBlood;
