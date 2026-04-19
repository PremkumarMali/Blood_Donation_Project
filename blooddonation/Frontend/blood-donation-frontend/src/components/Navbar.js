import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link className="navbar-brand" to="/">
          Blood Donation System
        </Link>

        <div>

          <Link className="nav-link d-inline text-white" to="/">Dashboard</Link>
          <Link className="nav-link d-inline text-white" to="/donors">Donors</Link>
          <Link className="nav-link d-inline text-white" to="/hospitals">Hospitals</Link>
          <Link className="nav-link d-inline text-white" to="/storage">Storage</Link>
          <Link className="nav-link d-inline text-white" to="/patients">Patients</Link>
          <Link className="nav-link d-inline text-white" to="/orders">Orders</Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;