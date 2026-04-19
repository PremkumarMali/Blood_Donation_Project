import { Link } from "react-router-dom";

function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "ADMIN";


  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>

      <h4 className="text-center">Blood System</h4>

      <p className="text-center">
        Welcome {user?.username}
      </p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-white" to={isAdmin ? "/admin" : (user?.role === "HOSPITAL" ? "/hospital" : "/user")}>
            🏠 Dashboard
          </Link>
        </li>

        {isAdmin && (
          <>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/storage">📦 Storage</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/deliveries">🚚 Deliveries</Link>
            </li>
          </>
        )}

        {user?.role === "HOSPITAL" && (
          <>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/hospital/orders">🩸 Blood Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/hospital/deliveries">🚚 My Deliveries</Link>
            </li>
          </>
        )}

        {user?.role === "USER" && (
          <>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/user/find-donor">🔍 Find Donor</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/user/donors">🤝 Donors</Link>
            </li>
          </>
        )}

        <li className="nav-item mt-3">
          <Link className="nav-link text-white" to={isAdmin ? "/admin/profile" : (user?.role === "HOSPITAL" ? "/hospital/profile" : "/user/profile")}>
            👤 Profile
          </Link>
        </li>
      </ul>


      <button
        className="btn btn-danger mt-4 w-100"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;