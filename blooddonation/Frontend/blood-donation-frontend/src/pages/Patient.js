import { useEffect, useState } from "react";
import axios from "axios";

function Patient() {

  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    hospitalId: "",
    contact: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!formData.name || !formData.bloodGroup || !formData.hospitalId) {
      alert("Please fill all required fields");
      return;
    }

    const data = {
      ...formData,
      hospitalId: parseInt(formData.hospitalId)
    };

    try {
      await axios.post("http://localhost:8080/api/patients", data);

      fetchPatients();

      setFormData({
        name: "",
        bloodGroup: "",
        hospitalId: "",
        contact: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error adding patient");
    }
  };

  return (
    <div className="container mt-4">

      <h2>Add Patient</h2>

      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-3">
          <input
            className="form-control"
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            name="bloodGroup"
            placeholder="Blood Group"
            value={formData.bloodGroup}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            name="hospitalId"
            placeholder="Hospital ID"
            value={formData.hospitalId}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Add Patient</button>
        </div>

      </form>

      <hr />

      <h2>Patient List</h2>

      <table className="table table-bordered">

        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Blood Type</th>
            <th>Hospital ID</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.bloodGroup}</td>
              <td>{p.hospitalId}</td>
              <td>{p.contact}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Patient;