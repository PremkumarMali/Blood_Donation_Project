import { useEffect, useState } from "react";
import axios from "axios";

function Order() {

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "ADMIN";

  const [orders, setOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
    locationId: "",
    locationName: ""
  });

  useEffect(() => {
    fetchOrders();
    fetchApprovedOrders();
    fetchStorage();
    fetchLocations();
    if (isAdmin) {
      fetchAppointments();
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/donations/locations");
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/donations/location/${user.user_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/donations/${id}/status?status=${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStorage = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/storage/location/${user.user_id}`);
      setStorageData(res.data);
    } catch (error) {
      console.error("Error fetching storage:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      if (isAdmin) {
        // Fetch ALL pending orders so Admin can see global SOS requests
        const res = await axios.get(`http://localhost:8080/api/orders`);
        setOrders(res.data.filter(o => o.status === "PENDING"));
      } else {
        const userRes = await axios.get(`http://localhost:8080/api/orders/user/${user.user_id}`);
        setOrders(userRes.data.filter(o => o.status === "PENDING"));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchApprovedOrders = async () => {
    try {
      if (isAdmin) {
        const res = await axios.get(`http://localhost:8080/api/orders/approved`);
        setApprovedOrders(res.data);
      } else {
        const res = await axios.get(`http://localhost:8080/api/orders/user/${user.user_id}`);
        setApprovedOrders(res.data.filter(o => o.status === "APPROVED"));
      }
    } catch (error) {
      console.error("Error fetching approved orders:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      // Pass adminId so backend knows which bank is fulfilling the request
      const response = await axios.put(`http://localhost:8080/api/orders/${id}/approve?adminId=${user.user_id}`);
      alert("Order Approved Successfully");
      fetchOrders();
      fetchApprovedOrders();
      fetchStorage(); 
    } catch (error) {
      console.error("Approve Error:", error);
      const msg = error.response?.data?.message || error.response?.data || "Error: Ensure you have enough stock and the blood type matches exactly.";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  const getAvailableUnits = (bloodGroup) => {
    const item = storageData.find(s => s.bloodType === bloodGroup);
    return item ? item.units : 0;
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/reject`);
      alert("Order Rejected");
      fetchOrders();
      fetchApprovedOrders();
    } catch (error) {
      console.error("Reject Error:", error);
      const msg = error.response?.data?.message || error.response?.data || "Error rejecting order";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "location") {
      const loc = locations.find(l => l.id == e.target.value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const check = await axios.get(
        `http://localhost:8080/api/storage/check/${formData.bloodGroup}`
      );

      if (!check.data || check.data.length === 0 || check.data[0].units <= 0) {
        alert("Blood not available currently");
        return;
      }

      await axios.post("http://localhost:8080/api/orders", {
        userId: user.user_id,
        userName: user.username,
        location: formData.locationName || user.location || "Not specified",
        locationId: formData.locationId,
        contact: user.contact || "N/A",
        bloodGroup: formData.bloodGroup,
        units: parseInt(formData.units)
      });


      alert("Blood request sent successfully");
      fetchOrders();
      setFormData({ bloodGroup: "", units: "", locationId: "", locationName: "" });

    } catch (error) {
      console.error("Submit Error:", error);
      const msg = error.response?.data?.message || error.response?.data || "Error sending request";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  return (
    <div className="container py-4 page-enter">

      <div className="glass-card p-4 mb-5 border-0">
        <h2 className="text-premium mb-4">Request Blood {isAdmin && "(From Other Banks)"}</h2>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
            <label className="form-label text-premium fw-bold small">Blood Group</label>
              <select 
                className="form-select auth-input" 
                name="bloodGroup" 
                value={formData.bloodGroup} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
            <label className="form-label text-premium fw-bold small">Units Needed</label>
              <input
                type="number"
                className="form-control auth-input"
                name="units"
                placeholder="Enter units"
                value={formData.units}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="col-md-4">
            <label className="form-label text-premium fw-bold small">Select Blood Bank/Hospital</label>
              <select 
                className="form-select auth-input" 
                name="location" 
                value={formData.locationId} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">Request</button>
            </div>
          </form>
        </div>

      <div className="glass-card p-4 mb-5 border-0">
        <h3 className="text-premium mb-4 d-flex align-items-center">
          <span className="me-3">⏳</span>
          {isAdmin ? "Manage Blood Requests" : "My Pending Requests"}
        </h3>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="border-0">ID</th>
                <th className="border-0">Requested By</th>
                <th className="border-0">Location</th>
                <th className="border-0">Blood Group</th>
                <th className="border-0">Requested Units</th>
                {isAdmin && <th className="border-0">Storage Availability</th>}
                <th className="border-0">Status</th>
                {isAdmin && <th className="border-0">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 6} className="text-center text-muted py-5">
                    No pending requests found
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const available = getAvailableUnits(o.bloodGroup);
                  const canApprove = available >= o.units;

                  return (
                    <tr key={o.orderId}>
                      <td className="fw-bold text-muted">#{o.orderId}</td>
                      <td>
                        <div className="fw-bold">{o.userName || `User #${o.userId}`}</div>
                        <div className="small text-muted">{o.contact}</div>
                      </td>
                      <td>
                        <div className="small"><span className="me-1">📍</span>{o.location || 'Not Specified'}</div>
                      </td>
                      <td>
                        <span className="badge bg-danger text-white px-3 py-2">
                          {o.bloodGroup} {o.isEmergency && <span className="ms-1 animate-pulse">🆘</span>}
                        </span>
                      </td>

                      <td className="fw-semibold">{o.units} Units</td>
                      {isAdmin && (
                        <td>
                          <span className={`fw-bold ${canApprove ? "text-success" : "text-danger"}`}>
                            {available} Units Available
                          </span>
                        </td>
                      )}
                      <td>
                        <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-3 py-2">
                          {o.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <button 
                            className={`btn btn-sm rounded-pill px-3 me-2 ${canApprove ? "btn-success" : "btn-secondary"}`} 
                            onClick={() => handleApprove(o.orderId)}
                            disabled={!canApprove}
                            title={!canApprove ? "Insufficient units in storage" : "Approve request"}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-3" 
                            onClick={() => handleReject(o.orderId)}
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>


      {isAdmin && (
        <div className="glass-card p-4 mb-5 border-0">
          <h3 className="text-premium mb-4 d-flex align-items-center">
            <span className="me-3">🩸</span>
            Donation Appointments
          </h3>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0">Donor</th>
                  <th className="border-0">Blood Type</th>
                  <th className="border-0">Date</th>
                  <th className="border-0">Slot</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="fw-bold">{a.userName}</div>
                    </td>
                    <td>
                      <span className="badge bg-danger text-white px-3 py-2">
                        {a.bloodType}
                      </span>
                    </td>
                    <td>{a.donationDate}</td>
                    <td>{a.timeSlot}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${
                        a.status === 'PENDING' ? 'bg-warning bg-opacity-10 text-warning' : 
                        a.status === 'APPROVED' ? 'bg-primary bg-opacity-10 text-primary' : 
                        'bg-success bg-opacity-10 text-success'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "PENDING" && (
                        <>
                          <button className="btn btn-sm btn-success rounded-pill px-3 me-2" onClick={() => updateAppointmentStatus(a.id, "APPROVED")}>Approve</button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => updateAppointmentStatus(a.id, "REJECTED")}>Reject</button>
                        </>
                      )}
                      {a.status === "APPROVED" && (
                        <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => updateAppointmentStatus(a.id, "COMPLETED")}>Mark Completed</button>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No donation appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="glass-card p-4 border-0">
        <h3 className="text-premium mb-4 d-flex align-items-center">
          <span className="me-3">📜</span>
          Approved Blood Request History
        </h3>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="border-0">ID</th>
                <th className="border-0">User ID</th>
                <th className="border-0">Blood Group</th>
                <th className="border-0">Units</th>
                <th className="border-0">Approved At</th>
                <th className="border-0">Status</th>
              </tr>
            </thead>

            <tbody>
              {approvedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    No approved requests found
                  </td>
                </tr>
              ) : (
                approvedOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td className="fw-bold text-muted">#{o.orderId}</td>
                    <td>{o.userId}</td>
                    <td>
                      <span className="badge bg-danger text-white px-3 py-2">
                        {o.bloodGroup}
                      </span>
                    </td>
                    <td className="fw-semibold">{o.units} Units</td>
                    <td className="text-muted small">
                      {o.approvedAt ? new Date(o.approvedAt).toLocaleString() : "-"}
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2">
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
  );
}

export default Order;