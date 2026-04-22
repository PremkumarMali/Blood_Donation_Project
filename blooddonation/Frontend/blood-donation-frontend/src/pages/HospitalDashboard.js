import { useEffect, useState } from "react";
import axios from "axios";
import InventoryAnalytics from "../components/InventoryAnalytics";

function HospitalDashboard() {

  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [globalSOS, setGlobalSOS] = useState([]);

  const [patientData, setPatientData] = useState({
    name: "",
    bloodGroup: "",
    contact: ""
  });

  const [requestData, setRequestData] = useState({
    bloodGroup: "",
    units: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPatients();
    fetchOrders();
    fetchAppointments();
    fetchGlobalSOS();
  }, []);

  const fetchGlobalSOS = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/emergency");
      // Filter out SOS from this hospital itself
      setGlobalSOS(res.data.filter(s => s.userId !== user.user_id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch Donation Appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/donations/location/${user.user_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update Appointment Status
  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/donations/${id}/status?status=${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch Patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/patients/hospital/${user.user_id}`);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/orders/user/${user.user_id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Handle Patient Input
  const handlePatientChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Add Patient
  const addPatient = async (e) => {
    e.preventDefault();

    if (!user || !user.user_id) {
      alert("User not logged in or invalid hospital data");
      return;
    }

    try {
      const data = {
        ...patientData,
        hospitalId: user.user_id
      };

      await axios.post("http://localhost:8080/api/patients", data);
      fetchPatients();

      setPatientData({
        name: "",
        bloodGroup: "",
        contact: ""
      });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || "Error";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  // 🔥 Handle Request Input
  const handleRequestChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Raise Blood Request
  const raiseRequest = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...requestData,
        userId: user.user_id,
        userName: user.hospitalName || user.username,
        location: user.address || user.hospitalName || user.username,
        units: parseInt(requestData.units),
        isEmergency: requestData.isEmergency || false
      };

      await axios.post("http://localhost:8080/api/orders", data);
      fetchOrders();

      setRequestData({
        bloodGroup: "",
        units: "",
        isEmergency: false
      });

      alert(data.isEmergency ? "EMERGENCY SOS RAISED!" : "Blood request raised successfully!");

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || "Error raising request";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  return (
    <div className="container mt-4 text-white">

      <h2 className="mb-4 fw-bold" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "1px" }}>Hospital Dashboard</h2>

      {/* 🚨 GLOBAL SOS ALERT BANNER */}
      {globalSOS.length > 0 && (
        <div className="alert alert-danger border-0 shadow-sm mb-4 pulse-animation d-flex align-items-center" 
             style={{ background: 'rgba(220, 38, 38, 0.1)', borderLeft: '5px solid #dc2626' }}>
          <div className="me-3 fs-3">🚨</div>
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-1">REGIONAL SOS: Other Hospitals Need Help!</h5>
            <div className="small">
              There are {globalSOS.length} active emergency requests in your region.
            </div>
            <div className="mt-2 d-flex gap-2 flex-wrap">
              {globalSOS.map((e, i) => (
                <span key={i} className="badge bg-danger p-2">
                  {e.bloodGroup} at {e.userName || 'Hospital'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        {/* 📊 ANALYTICS SECTION */}
        <div className="col-md-8">
           <InventoryAnalytics locationId={user.user_id} />
        </div>

        {/* 🩸 LOCAL STORAGE VIEW */}
        <div className="col-md-4">
          <div className="glass-card p-4 h-100 shadow-sm border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h4 className="fw-bold mb-3 text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Hospital Inventory</h4>
            <div className="table-responsive" style={{ maxHeight: '250px' }}>
              <table className="table table-sm table-hover table-dark table-borderless bg-transparent">
                <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <tr>
                    <th>Blood Type</th>
                    <th>Units</th>
                  </tr>
                </thead>
                <tbody>
                  {/* We'll need to fetch this state or let the InventoryAnalytics handle the visual part */}
                  <tr className="small text-muted">
                    <td colSpan="2" className="text-center">Live stock updates based on completed donations and received orders.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 ADD PATIENT */}
      <div className="glass-card p-4 mb-4 shadow border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <h4 className="fw-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Add Patient</h4>

        <form onSubmit={addPatient} className="row g-3">

          <div className="col-md-4">
            <input
              className="form-control"
              name="name"
              placeholder="Patient Name"
              value={patientData.name}
              onChange={handlePatientChange}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="bloodGroup"
              placeholder="Blood Group"
              value={patientData.bloodGroup}
              onChange={handlePatientChange}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="contact"
              placeholder="Contact"
              value={patientData.contact}
              onChange={handlePatientChange}
            />
          </div>

          <div className="col-md-12">
            <button className="btn btn-primary w-100">
              Add Patient
            </button>
          </div>

        </form>
      </div>

      {/* 🔥 RAISE BLOOD REQUEST */}
      <div className="glass-card p-4 mb-4 shadow border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <h4 className="fw-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Raise Blood Request</h4>

        <form onSubmit={raiseRequest} className="row g-3">

          <div className="col-md-6">
            <input
              className="form-control"
              name="bloodGroup"
              placeholder="Blood Group"
              value={requestData.bloodGroup}
              onChange={handleRequestChange}
            />
          </div>

          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              name="units"
              placeholder="Units"
              value={requestData.units}
              onChange={handleRequestChange}
            />
          </div>

          <div className="col-md-12 d-flex align-items-center">
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="emergencySwitch"
                checked={requestData.isEmergency || false}
                onChange={(e) => setRequestData({...requestData, isEmergency: e.target.checked})}
              />
              <label className="form-check-label text-danger fw-bold ms-2" htmlFor="emergencySwitch">
                🚨 Mark as Emergency Request (Priority)
              </label>
            </div>
          </div>

          <div className="col-md-12">
            <button className={`btn ${requestData.isEmergency ? 'btn-danger pulse-animation' : 'btn-danger'} w-100`}>
              {requestData.isEmergency ? 'RAISE EMERGENCY SOS' : 'Request Blood'}
            </button>
          </div>

        </form>
      </div>

      {/* 🔥 PATIENT LIST */}
      <h4 className="fw-bold text-white mt-5 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Patients</h4>
      <div className="glass-card p-3 border-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <table className="table table-dark table-hover table-borderless mb-0 bg-transparent">
          <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            <tr>
              <th className="text-white-50">Name</th>
              <th className="text-white-50">Blood</th>
              <th className="text-white-50">Contact</th>
            </tr>
          </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.bloodGroup}</td>
              <td>{p.contact}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* 🔥 DONATION APPOINTMENTS */}
      <h4 className="fw-bold text-white mt-5 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Donation Appointments</h4>
      <div className="glass-card p-3 border-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <table className="table table-dark table-hover table-borderless mb-0 bg-transparent">
          <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            <tr>
              <th className="text-white-50">Donor Name</th>
              <th className="text-white-50">Blood Type</th>
              <th className="text-white-50">Date</th>
              <th className="text-white-50">Slot</th>
              <th className="text-white-50">Status</th>
              <th className="text-white-50">Actions</th>
            </tr>
          </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.userName}</td>
              <td>{a.bloodType}</td>
              <td>{a.donationDate}</td>
              <td>{a.timeSlot}</td>
              <td>{a.status}</td>
              <td>
                {a.status === "PENDING" && (
                  <>
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={() => updateAppointmentStatus(a.id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => updateAppointmentStatus(a.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {a.status === "APPROVED" && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => updateAppointmentStatus(a.id, "COMPLETED")}
                  >
                    Mark Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-3">No donation appointments found.</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* 🔥 REQUEST LIST */}
      <h4 className="fw-bold text-white mt-5 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Blood Requests</h4>
      <div className="glass-card p-3 border-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <table className="table table-dark table-hover table-borderless mb-0 bg-transparent">
          <thead style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            <tr>
              <th className="text-white-50">Blood</th>
              <th className="text-white-50">Units</th>
              <th className="text-white-50">Status</th>
            </tr>
          </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId}>
              <td>{o.bloodGroup}</td>
              <td>{o.units}</td>
              <td>{o.status}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* 🌍 GOOGLE MAP */}
      <h4 className="fw-bold text-white mt-5 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Nearby Blood Banks & Camps</h4>
      <iframe
        src="https://www.google.com/maps?q=blood+bank+near+me&output=embed"
        width="100%"
        height="300"
        title="map"
      ></iframe>

    </div>
  );
}

export default HospitalDashboard;