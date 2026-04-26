import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="dashboard-navbar mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/" style={{textDecoration: 'none'}}>
          <span className="brand-animated-bg fs-4">❤️ BloodLink</span>
        </Link>

        <div className="d-flex gap-4">
          <Link className="nav-link" to="/">Dashboard</Link>
          <Link className="nav-link" to="/donors">Donors</Link>
          <Link className="nav-link" to="/hospitals">Hospitals</Link>
          <Link className="nav-link" to="/storage">Storage</Link>
          <Link className="nav-link" to="/patients">Patients</Link>
          <Link className="nav-link" to="/orders">Orders</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;