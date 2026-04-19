import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ ALWAYS call hooks first
  useEffect(() => {
    fetchOrders();
    fetchApprovedOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:8080/api/orders");
    setOrders(res.data);
  };

  const fetchApprovedOrders = async () => {
    const res = await axios.get("http://localhost:8080/api/orders/approved");
    setApprovedOrders(res.data);
  };

  // 🔒 AFTER hooks → condition check
  if (!user || user.role !== "ADMIN") {
    return <h3 className="text-danger text-center mt-5">Access Denied</h3>;
  }

  const approveOrder = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/approve`);
      fetchOrders();
      fetchApprovedOrders();
    } catch (err) {
      alert("Error approving request");
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

  return (
    <div className="container mt-4">
      <h2>Blood Bank Manager Dashboard</h2>

      <table className="table table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>Blood Group</th>
            <th>Units</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders
            .filter(o => o.status === "PENDING")
            .map((o) => (
              <tr key={o.orderId}>
                <td>{o.userId}</td>
                <td>{o.bloodGroup}</td>
                <td>{o.units}</td>

                <td>
                  <span className="badge bg-warning text-dark">
                    {o.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approveOrder(o.orderId)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => rejectOrder(o.orderId)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
        </tbody>

      </table>

      <h3 className="mt-5">Approved Request History</h3>

      <table className="table table-bordered mt-4">

        <thead className="table-dark">
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
              <td colSpan="5" className="text-center text-muted">
                No approved requests yet
              </td>
            </tr>
          ) : (
            approvedOrders.map((o) => (
              <tr key={o.orderId}>

                <td>{o.userId}</td>
                <td>{o.bloodGroup}</td>
                <td>{o.units}</td>
                <td>{o.approvedAt ? new Date(o.approvedAt).toLocaleString() : "-"}</td>

                <td>
                  <span className="badge bg-success">
                    {o.status}
                  </span>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default AdminDashboard;