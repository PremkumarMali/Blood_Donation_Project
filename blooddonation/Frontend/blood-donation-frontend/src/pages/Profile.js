import { useState, useEffect } from "react";
import axios from "axios";
import BadgeSystem from "../components/BadgeSystem";

function Profile() {

  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    
    if (loggedUser) {
      axios.get(`http://localhost:8080/api/users/${loggedUser.user_id}`)
        .then(res => {
          setUser(res.data);
          setEditData(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        });

      axios
        .get(`http://localhost:8080/api/orders/user/${loggedUser.user_id}`)
        .then(res => setRequests(res.data));
    }
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/users/${user.user_id}`, editData)
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsEditing(false);
        alert("Profile updated successfully!");
      })
      .catch(err => {
        console.error("Update Error:", err);
        const msg = err.response?.data?.message || err.response?.data || "Failed to update profile.";
        alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      });
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-premium mb-0">My Profile</h2>
        <button 
          className="btn btn-primary rounded-pill px-4 btn-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="row mb-5">
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 border-0 shadow-lg text-center">
            <div className="auth-icon mb-3" style={{fontSize: '5rem'}}>👤</div>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="text-start">
                <div className="mb-3">
                  <label className="small text-uppercase opacity-75">Username</label>
                  <input 
                    className="form-control glass-input" 
                    value={editData.username || ""} 
                    onChange={e => setEditData({...editData, username: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="small text-uppercase opacity-75">Email</label>
                  <input 
                    className="form-control glass-input" 
                    value={editData.email || ""} 
                    onChange={e => setEditData({...editData, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="small text-uppercase opacity-75">Phone</label>
                  <input 
                    className="form-control glass-input" 
                    value={editData.phone || ""} 
                    onChange={e => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="small text-uppercase opacity-75">Address</label>
                  <textarea 
                    className="form-control glass-input" 
                    rows="2"
                    value={editData.address || ""} 
                    onChange={e => setEditData({...editData, address: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-danger w-100 rounded-pill mt-3">Save Changes</button>
              </form>
            ) : (
              <>
                <h4 className="fw-bold">{user?.username}</h4>
                <p className="text-muted small mb-0">{user?.role || 'Donor'}</p>
                <hr className="my-4 opacity-25" />
                <div className="text-start">
                  <p className="mb-1 opacity-75 small text-uppercase">Email</p>
                  <p className="fw-bold small">{user?.email}</p>
                  <p className="mb-1 mt-3 opacity-75 small text-uppercase">Phone</p>
                  <p className="fw-bold small">{user?.phone || "Not set"}</p>
                  <p className="mb-1 mt-3 opacity-75 small text-uppercase">Address</p>
                  <p className="fw-bold small">{user?.address || "Not set"}</p>
                  <p className="mb-1 mt-3 opacity-75 small text-uppercase">Blood Group</p>
                  <span className="badge bg-danger px-3">{user?.bloodGroup || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-md-8">
           <BadgeSystem badges={user?.badges} points={user?.points} />
        </div>
      </div>

      <h3 className="text-premium mb-4">My Blood Requests</h3>

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