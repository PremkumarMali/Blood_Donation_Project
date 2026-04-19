import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {

  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);

    if (loggedUser) {
      axios
        .get(`http://localhost:8080/api/orders/user/${loggedUser.user_id}`)
        .then(res => setRequests(res.data));
    }
  }, []);

  return (
    <div className="py-4">
      <h2 className="fw-bold mb-4 text-white">User Profile</h2>

      <div className="glass-card p-4 mb-5 border-0 shadow-lg">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-2 opacity-75">Username</p>
            <h5 className="fw-bold">{user?.username}</h5>
          </div>
          <div className="col-md-6">
            <p className="mb-2 opacity-75">Email Address</p>
            <h5 className="fw-bold">{user?.email}</h5>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-4 text-white">My Blood Requests</h3>

      <div className="glass-card p-4 border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{color: 'inherit'}}>
            <thead className="table-dark opacity-75">
              <tr>
                <th className="border-0">Blood Group</th>
                <th className="border-0">Units</th>
                <th className="border-0">Status</th>
              </tr>
            </thead>
            <tbody className="fw-medium">
              {requests.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-4 opacity-50">No requests found</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.orderId || r.order_id}>
                    <td><span className="badge bg-danger bg-opacity-10 text-danger px-3">{r.bloodGroup || r.blood_group}</span></td>
                    <td>{r.units} Units</td>
                    <td>
                      <span className={`badge rounded-pill px-3 ${r.status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {r.status}
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

export default Profile;