import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import HospitalLayout from "./layouts/HospitalLayout";
import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";

// ✅ Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Donor from "./pages/Donor";
import HospitalDashboard from "./pages/HospitalDashboard";
import Storage from "./pages/Storage";
import Patient from "./pages/Patient";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import FindDonor from "./pages/FindDonor";
import Deliveries from "./pages/Deliveries";
import DonateBlood from "./pages/DonateBlood";


// ✅ Role protection
const RoleRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🌐 PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* 🔐 AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 👤 USER */}
        <Route
          path="/user"
          element={
            <RoleRoute role="USER">
              <DashboardLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="find-donor" element={<FindDonor />} />
          <Route path="donate-blood" element={<DonateBlood />} />
          <Route path="donors" element={<Donor />} />
          <Route path="patients" element={<Patient />} />
        </Route>

        {/* 🧑‍💼 ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="ADMIN">
              <AdminLayout />   {/* ✅ FIXED */}
            </RoleRoute>
          }
        >
          <Route index element={<Orders />} />
          <Route path="storage" element={<Storage />} />
          <Route path="deliveries" element={<Deliveries />} />
        </Route>


        {/* 🏥 HOSPITAL */}
        <Route
          path="/hospital"
          element={
            <RoleRoute role="HOSPITAL">
              <HospitalLayout />   {/* ✅ FIXED */}
            </RoleRoute>
          }
        >
          <Route index element={<HospitalDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="deliveries" element={<Deliveries />} />
        </Route>


        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;