import { useState, useEffect } from "react";
import axios from "axios";
import BadgeSystem from "../components/BadgeSystem";

function Profile() {

  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    
    if (loggedUser) {
      // Fetch latest user data to get points/badges
      axios.get(`http://localhost:8080/api/users/${loggedUser.user_id}`)
        .then(res => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        });

      axios
        .get(`http://localhost:8080/api/orders/user/${loggedUser.user_id}`)
        .then(res => setRequests(res.data));
    }
  }, []);

  return (
    <div className="py-4">
      <h2 className="fw-bold mb-4 text-white">My Profile</h2>

      <div className="row mb-5">
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 border-0 shadow-lg text-center">
            <div className="auth-icon mb-3" style={{fontSize: '5rem'}}>👤</div>
            <h4 className="fw-bold">{user?.username}</h4>
            <p className="text-muted small mb-0">{user?.role || 'Donor'}</p>
            <hr className="my-4 opacity-25" />
            <div className="text-start">
              <p className="mb-1 opacity-75 small text-uppercase">Email</p>
              <p className="fw-bold small">{user?.email}</p>
              <p className="mb-1 mt-3 opacity-75 small text-uppercase">Blood Group</p>
              <span className="badge bg-danger px-3">{user?.bloodGroup || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="col-md-8">
           <BadgeSystem badges={user?.badges} points={user?.points} />
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