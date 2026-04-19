import { useEffect, useState } from "react";
import axios from "axios";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "ADMIN";

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const url = isAdmin 
        ? `http://localhost:8080/api/deliveries/location/${user.user_id}` 
        : `http://localhost:8080/api/deliveries/user/${user.user_id}`;
      const res = await axios.get(url);
      setDeliveries(res.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/deliveries/${id}/status`, status, {
        headers: { "Content-Type": "application/json" }
      });
      alert(`Status updated to: ${status}`);
      fetchDeliveries();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-success";
      case "OUT_FOR_DELIVERY": return "bg-primary";
      default: return "bg-warning text-dark";
    }
  };

  return (
    <div className="container py-4 page-enter">
      <div className="glass-card p-4 border-0">
        <h2 className="fw-bold mb-4 text-primary d-flex align-items-center">
          <span className="me-3">🚚</span>
          {isAdmin ? "Manage Blood Deliveries" : "My Blood Deliveries"}
        </h2>

        {/* 🗺️ LIVE TRACKER SIMULATION */}
        <div className="mb-5">
          <h5 className="fw-bold mb-3 text-muted">Live Tracking Map</h5>
          <div className="rounded-4 overflow-hidden shadow-sm position-relative" style={{ height: '300px' }}>
            <iframe
              src="https://www.google.com/maps?q=blood+bank+delivery&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="delivery-map"
            ></iframe>
            <div className="position-absolute bottom-0 start-0 m-3 p-3 glass-card shadow-lg" style={{ maxWidth: '250px' }}>
              <div className="d-flex align-items-center text-success fw-bold mb-1">
                <span className="pulse-animation me-2" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                Live Activity
              </div>
              <div className="small text-muted">
                {deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length > 0 
                  ? `${deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length} vehicles currently on route.`
                  : "No active deliveries at the moment."}
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0">Delivery ID</th>
                <th className="border-0">Recipient</th>
                <th className="border-0">Location</th>
                <th className="border-0">Blood Details</th>
                <th className="border-0">Date</th>
                <th className="border-0">Status</th>
                {isAdmin && <th className="border-0">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center text-muted py-5">
                    No delivery records found
                  </td>
                </tr>
              ) : (
                deliveries.map((d) => (
                  <tr key={d.deliveryId}>
                    <td className="fw-bold text-muted">#DEL-{d.deliveryId}</td>
                    <td>
                      <div className="fw-bold">{d.userName}</div>
                      <div className="small text-muted">{d.contact}</div>
                    </td>
                    <td>
                      <div className="small">📍 {d.location}</div>
                    </td>
                    <td>
                      <div>
                        <span className="badge bg-danger bg-opacity-10 text-danger me-2">{d.bloodGroup}</span>
                        <span className="fw-semibold">{d.units} Units</span>
                      </div>
                    </td>
                    <td className="text-muted small">
                      {new Date(d.deliveryDate).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${getStatusBadge(d.status)}`}>
                        {d.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            Update
                          </button>
                          <ul className="dropdown-menu shadow border-0">
                            <li>
                              <button className="dropdown-item" onClick={() => updateStatus(d.deliveryId, "OUT_FOR_DELIVERY")}>
                                🏍️ Out for Delivery
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => updateStatus(d.deliveryId, "DELIVERED")}>
                                ✅ Delivered
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Deliveries;
