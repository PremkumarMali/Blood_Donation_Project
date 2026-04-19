import { useEffect, useState } from "react";
import axios from "axios";

function Hospital() {

  const [hospitals, setHospitals] = useState([]);

  const [formData, setFormData] = useState({
    hospitalName: "",
    location: "",
    contactNumber: ""
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hospitals");
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching hospitals");
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

    try {
      await axios.post("http://localhost:8080/api/hospitals", formData);

      fetchHospitals();

      setFormData({
        hospitalName: "",
        location: "",
        contactNumber: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error adding hospital");
    }
  };

  return (
    <div className="container mt-4">

      <h2>Add Hospital</h2>

      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-4">
          <input
            className="form-control"
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Add Hospital</button>
        </div>

      </form>

      <hr />

      <h2>Hospital List</h2>

      <table className="table table-bordered">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          {hospitals.length > 0 ? (
            hospitals.map((h) => (
              <tr key={h.hospitalId}>
                <td>{h.hospitalId}</td>
                <td>{h.hospitalName}</td>
                <td>{h.location}</td>
                <td>{h.contactNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hospitals found
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}

export default Hospital;