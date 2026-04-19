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
      });
      fetchAppointments(user.user_id);
    } catch (err) {
      toast.error("Failed to book appointment.");
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="glass-card p-5 mb-5 shadow-lg border-0 rounded-4">
        <div className="text-center mb-4">
          <i className="bi bi-heart-fill text-danger fs-1"></i>
          <h2 className="fw-bold text-danger mt-2">Donate Blood - Save Lives</h2>
          <p className="text-muted">Fill in the details to schedule your donation appointment.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">Blood Type</label>
            <select
              className="form-select glass-input"
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
            <label className="form-label fw-bold">Select Location (Blood Bank / Hospital)</label>
            <select
              className="form-select glass-input"
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
            <label className="form-label fw-bold">Donation Date</label>
            <input
              type="date"
              className="form-control glass-input"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Preferred Time Slot</label>
            <select
              className="form-select glass-input"
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

          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-danger btn-lg px-5 shadow rounded-pill">
              Book Appointment
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card p-4 shadow-lg border-0 rounded-4">
        <h4 className="mb-4 fw-bold"><i className="bi bi-clock-history me-2"></i>My Donation Appointments</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-danger">
              <tr>
                <th>Blood Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time Slot</th>
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
                  <td colSpan="5" className="text-center py-4 text-muted">No appointments found. Start by booking one above!</td>
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
