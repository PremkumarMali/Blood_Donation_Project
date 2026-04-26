import { Link } from "react-router-dom";

function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "ADMIN";


  return (
    <div className="glass-card vh-100" style={{ width: "260px", borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', padding: '2rem 1.5rem' }}>
      <h4 className="text-center mb-4"><span className="brand-animated-bg">❤️ BloodLink</span></h4>

      <div className="text-center mb-4">
        <p className="text-muted small text-uppercase fw-bold mb-1">Welcome back,</p>
        <h5 className="fw-bold">{user?.username}</h5>
      </div>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link className="nav-link rounded-3" to={isAdmin ? "/admin" : (user?.role === "HOSPITAL" ? "/hospital" : "/user")}>
            🏠 Dashboard
          </Link>
        </li>

        {isAdmin && (
          <>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/admin/storage">📦 Storage</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/admin/deliveries">🚚 Deliveries</Link>
            </li>
          </>
        )}

        {user?.role === "HOSPITAL" && (
          <>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/hospital/orders">🩸 Blood Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/hospital/deliveries">🚚 My Deliveries</Link>
            </li>
          </>
        )}

        {user?.role === "USER" && (
          <>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/user/find-donor">🔍 Find Donor</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link rounded-3" to="/user/donors">🤝 Donors</Link>
            </li>
          </>
        )}

        <li className="nav-item mt-2">
          <Link className="nav-link rounded-3" to={isAdmin ? "/admin/profile" : (user?.role === "HOSPITAL" ? "/hospital/profile" : "/user/profile")}>
            👤 Profile
          </Link>
        </li>
      </ul>

      <button
        className="btn btn-outline-danger mt-auto w-100 rounded-pill fw-bold"
        onClick={handleLogout}
        style={{ marginTop: 'auto' }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;