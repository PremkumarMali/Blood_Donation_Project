import React, { useEffect, useState } from "react";
import axios from "axios";
import ImpactCard from "../components/ImpactCard";
import BadgeSystem from "../components/BadgeSystem";

const donationFacts = [
  "One donation can save up to 3 lives.",
  "Every 2 seconds, someone needs blood.",
  "Blood cannot be manufactured — only donated.",
  "A single car accident victim may need up to 100 units.",
  "Only 37% of the population is eligible to donate.",
  "Donated blood lasts only 42 days.",
  "Type O- is the universal donor — always in high demand.",
];

function Dashboard() {

  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentFact, setCurrentFact] = useState(0);
  const theme = localStorage.getItem("theme") || "light";

  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
    locationId: "",
    locationName: ""
  });

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      // Re-fetch user to get latest points/badges
      fetchUserData(loggedUser.user_id);
      fetchOrders(loggedUser.user_id);
    }

    fetchEmergencyRequests();
    fetchLocations();

    // Rotate facts
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % donationFacts.length);
    }, 4000);

    return () => clearInterval(factInterval);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/donations/locations");
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Fetch user requests
  const fetchOrders = async (userId) => {
    const res = await axios.get(
      `http://localhost:8080/api/orders/user/${userId}`
    );
    setOrders(res.data);
  };

  // 🔥 Fetch all emergency requests (hospital requests)
  const fetchEmergencyRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/emergency");
      setEmergency(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "location") {
      const loc = locations.find(l => l.id === Number(e.target.value));
      if (loc) {
        setFormData({ ...formData, locationId: loc.id, locationName: loc.name });
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  // 🔥 Request Blood
  const handleRequest = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      userId: user.user_id,
      userName: user.username,
      units: parseInt(formData.units),
      location: formData.locationName,
      locationId: formData.locationId
    };

    await axios.post("http://localhost:8080/api/orders", data);

    fetchOrders(user.user_id);

    setFormData({ bloodGroup: "", units: "", locationId: "", locationName: "" });
  };

  return (
    <div className="position-relative">
      {/* ═══════════════════════════════════════════
          🎬 HERO SECTION — WHY DONATE BLOOD
         ═══════════════════════════════════════════ */}
      <section className="donor-hero-section mb-5">
        {/* Animated background orbs */}
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>

        <div className="row align-items-center g-0" style={{ minHeight: '380px' }}>
          {/* LEFT — Motivational Text */}
          <div className="col-lg-7 pe-lg-5 position-relative" style={{ zIndex: 2 }}>
            <span className="badge hero-tag mb-3">🩸 WHY DONATE BLOOD?</span>
            <h1 className="hero-headline">
              Your Blood Can <br />
              <span className="hero-highlight">Save Lives</span>
            </h1>
            <p className="hero-subtitle mt-3">
              Every drop counts. Blood donation is the most selfless act — a gift of life 
              that costs you nothing but means everything to someone in need.
            </p>

            {/* Rotating Fact */}
            <div className="hero-fact-box mt-4">
              <div className="hero-fact-icon">💡</div>
              <p className="hero-fact-text" key={currentFact}>
                {donationFacts[currentFact]}
              </p>
            </div>

            <div className="d-flex gap-3 mt-4 flex-wrap">
              <div className="hero-stat-pill">
                <span className="hero-stat-number">3</span>
                <span className="hero-stat-label">Lives per donation</span>
              </div>
              <div className="hero-stat-pill">
                <span className="hero-stat-number">10min</span>
                <span className="hero-stat-label">Average donation time</span>
              </div>
              <div className="hero-stat-pill">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Safe & Sterile</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Welcome Card */}
          <div className="col-lg-5 mt-4 mt-lg-0" style={{ zIndex: 2 }}>
            <div className="hero-welcome-card">
              <div className="hero-welcome-icon">❤️</div>
              <h3 className="hero-welcome-name">Welcome, {user.username}</h3>
              <p className="hero-welcome-role">Donor / Recipient</p>
              <div className="hero-welcome-divider"></div>
              <div className="d-flex justify-content-around text-center mt-3">
                <div>
                  <div className="hero-welcome-stat">{orders.length}</div>
                  <div className="hero-welcome-stat-label">Requests</div>
                </div>
                <div>
                  <div className="hero-welcome-stat">{user.rewardPoints || 0}</div>
                  <div className="hero-welcome-stat-label">Points</div>
                </div>
                <div>
                  <div className="hero-welcome-stat">{emergency.length}</div>
                  <div className="hero-welcome-stat-label">SOS Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚨 GLOBAL SOS ALERT BANNER */}
      {emergency.length > 0 && (
        <div className="dark-widget pulse-animation d-flex align-items-center mb-4" 
             style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="me-3 fs-3">🚨</div>
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-1 text-white">EMERGENCY SOS: Blood Needed Urgently!</h5>
            <div className="small text-white opacity-75">
              {emergency.filter(e => e.bloodGroup === user.bloodGroup).length > 0 
                ? `Immediate need for your blood group (${user.bloodGroup}) at nearby hospitals!` 
                : `${emergency.length} hospitals are requesting urgent blood supply. Can you help?`}
            </div>
            <div className="mt-2 d-flex gap-2 flex-wrap">
              {emergency.map((e, i) => (
                <span key={i} className="badge bg-danger p-2">
                  {e.bloodGroup} needed at {e.location || 'Hospital'}
                </span>
              ))}
            </div>
          </div>
          <button className="btn btn-light btn-sm fw-bold px-3 ms-3" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
            HELP NOW
          </button>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-md-12">
           <ImpactCard orders={orders} />
        </div>
      </div>

      {/* 🔹 Request Blood Widget */}
      <div className="dark-widget mb-5">
        <h4 className="fw-bold mb-3 text-white">🩸 Request Blood</h4>

        <form onSubmit={handleRequest} className="row g-3">
          <div className="col-md-3">
            <input
              className="form-control dark-widget-input"
              name="bloodGroup"
              placeholder="Blood Group (e.g. O+)"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control dark-widget-input"
              name="units"
              placeholder="Units"
              value={formData.units}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select dark-widget-input"
              name="location"
              value={formData.locationId}
              onChange={handleChange}
              required
            >
              <option value="">Select Bank/Hospital</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <button className="btn btn-danger w-100 fw-bold shadow-sm" style={{ borderRadius: '12px', padding: '12px' }}>
              Request Blood
            </button>
          </div>
        </form>
      </div>

      <div className="row">
        {/* 🔹 Your Requests */}
        <div className="col-md-12 mb-5">
          <div className="dark-widget">
            <h4 className="fw-bold mb-4 text-white">📋 Your Requests</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle dark-widget-table">
                <thead>
                  <tr>
                    <th>Blood</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="fw-medium">
                  {orders.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 opacity-50">No requests found</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.orderId}>
                        <td><span className="badge bg-danger bg-opacity-10 text-danger px-3">{o.bloodGroup}</span></td>
                        <td>{o.units}</td>
                        <td>
                          <span className={`badge rounded-pill px-3 ${o.status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🚨 Emergency Requests */}
        <div className="col-md-12 mb-5">
          <div className="dark-widget" style={{ borderLeft: '3px solid #ef4444' }}>
            <h4 className="fw-bold mb-4" style={{ color: '#f87171' }}>🚨 Emergency Blood Requests</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle dark-widget-table">
                <thead>
                  <tr>
                    <th>Blood</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="fw-medium">
                  {emergency.filter(e => e.status === "PENDING").length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 opacity-50">No emergency requests</td></tr>
                  ) : (
                    emergency.filter(e => e.status === "PENDING").map((e) => (
                      <tr key={e.orderId}>
                        <td className="fw-bold text-danger">{e.bloodGroup}</td>
                        <td>{e.units} Units</td>
                        <td><span className="badge bg-danger px-3">EMERGENCY</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🌍 Google Map */}
        <div className="col-md-12">
          <div className="dark-widget">
            <h4 className="fw-bold mb-4 text-white">📍 Nearby Blood Camps & Banks</h4>
            <div className="rounded-3 overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=blood+donation+camp+near+me&output=embed"
                width="100%"
                height="350"
                style={{border: 0, borderRadius: '12px', filter: theme === 'dark' || theme === 'blood' ? 'invert(90%) hue-rotate(180deg)' : 'none'}}
                title="map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;