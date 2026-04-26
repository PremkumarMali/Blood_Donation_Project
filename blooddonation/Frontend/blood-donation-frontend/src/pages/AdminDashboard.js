import { useEffect, useState } from "react";
import axios from "axios";
import InventoryAnalytics from "../components/InventoryAnalytics";
import NotificationSystem from "../components/NotificationSystem";

function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [storage, setStorage] = useState([]);
  const [newStock, setNewStock] = useState({ bloodType: "", units: 0 });
  const [loadingId, setLoadingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.user_id) {
      fetchOrders();
      fetchApprovedOrders();
      fetchStorage();
    }
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/storage/location/${user.user_id}`);
      setStorage(res.data);
    } catch (err) {
      console.error("Error fetching storage:", err);
    }
  };

  const addStock = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/storage", {
        ...newStock,
        locationId: user.user_id,
        locationName: user.bankName || user.username
      });
      alert("Stock updated!");
      fetchStorage();
      setNewStock({ bloodType: "", units: 0 });
    } catch (err) {
      alert("Error updating stock");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApprovedOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/approved");
      setApprovedOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveOrder = async (id) => {
    if (!window.confirm("Are you sure you want to approve this request? This will reduce your stock.")) return;
    
    setLoadingId(id);
    try {
      const res = await axios.put(`http://localhost:8080/api/orders/${id}/approve?adminId=${user.user_id}`);
      console.log("Approval response:", res.data);
      
      // Immediate state update
      setOrders(prev => prev.filter(o => o.orderId !== id));
      
      await Promise.all([fetchOrders(), fetchApprovedOrders(), fetchStorage()]);
      alert("Request approved successfully!");
    } catch (err) {
      console.error("Approval error details:", err);
      const msg = err.response?.data?.message || err.response?.data || "Error: Ensure you have enough stock and the blood type matches exactly.";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoadingId(null);
    }
  };

  const rejectOrder = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/reject`);
      fetchOrders();
      fetchApprovedOrders();
    } catch (err) {
      alert("Error rejecting request");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return <h3 className="text-danger text-center mt-5">Access Denied</h3>;
  }

  return (
    <div className="container mt-4 pb-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-premium">Blood Bank Manager Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          <NotificationSystem isAdmin={true} />
          <div className="badge bg-danger text-white p-2 px-3 rounded-pill shadow-sm">Location ID: #{user.user_id}</div>
        </div>
      </div>

      {/* 📊 ANALYTICS SECTION */}
      <InventoryAnalytics />

      <div className="row mt-5">
        {/* 🩸 STORAGE MANAGEMENT */}
        <div className="col-md-5">
          <div className="glass-card p-4 h-100 shadow-sm border-0">
            <h4 className="text-premium mb-4">Manage Inventory</h4>
            <form onSubmit={addStock} className="row g-2 mb-4">
              <div className="col-7">
                <input 
                  className="form-control" 
                  placeholder="Blood Type (e.g. O+)" 
                  value={newStock.bloodType}
                  onChange={(e) => setNewStock({...newStock, bloodType: e.target.value})}
                  required
                />
              </div>
              <div className="col-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Units" 
                  value={newStock.units}
                  onChange={(e) => setNewStock({...newStock, units: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="col-2">
                <button className="btn btn-primary w-100">+</button>
              </div>
            </form>

            <div className="table-responsive" style={{ maxHeight: '300px' }}>
              <table className="table table-sm table-hover table-borderless">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Units</th>
                  </tr>
                </thead>
                <tbody>
                  {storage.map((s, i) => (
                    <tr key={i}>
                      <td className="fw-bold text-danger">{s.bloodType}</td>
                      <td>{s.units} Units</td>
                    </tr>
                  ))}
                  {storage.length === 0 && <tr><td colSpan="2" className="text-center text-muted">No stock added yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 📝 PENDING REQUESTS */}
        <div className="col-md-7">
          <div className="glass-card p-4 shadow-sm border-0">
            <h4 className="text-premium mb-4">Pending Requests</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle table-borderless">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Location</th>
                    <th>Blood</th>
                    <th>Units</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(o => o.status === "PENDING")
                    .map((o) => (
                      <tr key={o.orderId} className={o.isEmergency ? 'table-danger' : ''}>
                        <td>
                          <div className="fw-bold">{o.userName || 'Unknown'}</div>
                          <div className="small text-muted">ID: #{o.userId}</div>
                        </td>
                        <td>
                           <div className="small fw-medium">{o.location || 'Not Specified'}</div>
                        </td>
                        <td className="fw-bold text-danger">{o.bloodGroup} {o.isEmergency && <span className="badge bg-danger ms-1 animate-pulse">SOS</span>}</td>
                        <td>{o.units} Units</td>
                        <td><span className={`badge ${o.isEmergency ? 'bg-danger text-white' : 'bg-warning text-dark'} rounded-pill px-3`}>{o.status}</span></td>
                        <td>
                          <button
                            className={`btn btn-sm me-2 ${o.isEmergency ? 'btn-danger pulse-animation' : 'btn-success'}`}
                            onClick={() => approveOrder(o.orderId)}
                            disabled={loadingId === o.orderId}
                          >
                            {loadingId === o.orderId ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => rejectOrder(o.orderId)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  {orders.filter(o => o.status === "PENDING").length === 0 && (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">No pending requests</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-premium">Approved Request History</h3>
      <div className="glass-card p-4 mt-3 shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle table-borderless">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Approved At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No approved requests yet
                  </td>
                </tr>
              ) : (
                approvedOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td>#{o.userId}</td>
                    <td><span className="badge bg-danger bg-opacity-10 text-danger">{o.bloodGroup}</span></td>
                    <td>{o.units} Units</td>
                    <td className="text-muted small">{o.approvedAt ? new Date(o.approvedAt).toLocaleString() : "-"}</td>
                    <td>
                      <span className="badge rounded-pill bg-success px-3">COMPLETED</span>
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

export default AdminDashboard;