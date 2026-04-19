import React, { useEffect, useState } from "react";
import axios from "axios";
import ImpactCard from "../components/ImpactCard";
import BadgeSystem from "../components/BadgeSystem";

function Dashboard() {

  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [locations, setLocations] = useState([]);
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
    <div className="py-4 position-relative">
      {/* 🎨 MESH BACKGROUND ELEMENTS */}
      <div className="mesh-bg">
        <div className="mesh-circle" style={{ width: '400px', height: '400px', background: '#ef4444', top: '10%', left: '20%' }}></div>
        <div className="mesh-circle" style={{ width: '300px', height: '300px', background: '#3b82f6', bottom: '20%', right: '10%', animationDelay: '-5s' }}></div>
      </div>

      {/* 🚨 GLOBAL SOS ALERT BANNER */}
      {emergency.length > 0 && (
        <div className="alert alert-danger border-0 shadow-lg mb-4 pulse-animation d-flex align-items-center glass-card" 
             style={{ background: 'rgba(220, 38, 38, 0.2)', backdropFilter: 'blur(10px)', borderLeft: '5px solid #dc2626 !important' }}>
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

      <h2 className="fw-bold mb-4 text-white">Welcome, {user.username}</h2>

      <div className="row mb-5">
        <div className="col-md-8">
           <BadgeSystem badges={user.badges} points={user.points} />
        </div>
        <div className="col-md-4">
           <ImpactCard orders={orders} />
        </div>
      </div>

      {/* 🔹 Glass Request Widget */}
      <div className="glass-card p-4 mb-5 border-0 shadow-lg">
        <h4 className="fw-bold mb-3 text-white">Request Blood</h4>

        <form onSubmit={handleRequest} className="row g-3">
          <div className="col-md-3">
            <input
              className="form-control glass-input"
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
              className="form-control glass-input"
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
              className="form-select glass-input"
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
            <button className="btn btn-danger w-100 fw-bold shadow-sm">
              Request Blood
            </button>
          </div>
        </form>
      </div>

      <div className="row">
        {/* 🔹 Your Requests */}
        <div className="col-md-12 mb-5">
          <div className="glass-card p-4 border-0">
            <h4 className="fw-bold mb-4 text-white">Your Requests</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{color: 'inherit'}}>
                <thead className="table-dark opacity-75">
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
          <div className="glass-card p-4 border-0" style={{background: 'rgba(239, 68, 68, 0.1)'}}>
            <h4 className="fw-bold mb-4 text-danger">Emergency Blood Requests</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-danger">
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
          <div className="glass-card p-4 border-0">
            <h4 className="fw-bold mb-4">Nearby Blood Camps & Banks</h4>
            <div className="rounded-3 overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=blood+donation+camp+near+me&output=embed"
                width="100%"
                height="350"
                style={{border: 0, filter: theme === 'dark' || theme === 'blood' ? 'invert(90%) hue-rotate(180deg)' : 'none'}}
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