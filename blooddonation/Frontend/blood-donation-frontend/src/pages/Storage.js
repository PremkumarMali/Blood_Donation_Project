import { useEffect, useState } from "react";
import axios from "axios";

function Storage() {

  const [storage, setStorage] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    bloodType: "",
    units: "",
    location: user.bankName || user.hospitalName || user.username,
    locationId: user.user_id
  });

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    const res = await axios.get(`http://localhost:8080/api/storage/location/${user.user_id}`);
    setStorage(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8080/api/storage", formData);

    fetchStorage();

    setFormData({
      ...formData,
      bloodType: "",
      units: ""
    });
  };

  return (
    <div className="container mt-4">

      <h2>Add Blood Storage</h2>

      <div className="glass-card p-4 mb-4 shadow">
        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-md-4">
            <input
              className="form-control"
              name="bloodType"
              placeholder="Blood Type"
              value={formData.bloodType}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="units"
              placeholder="Units"
              value={formData.units}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              name="location"
              placeholder="Storage Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary w-100">Add Storage</button>
          </div>

        </form>
      </div>

      <hr />

      <h2>Blood Storage List</h2>

      <table className="table table-bordered">

        <thead className="table-dark">
          <tr>
            <th>Blood Type</th>
            <th>Units</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>
          {storage.map((s) => (
            <tr key={s.storage_id}>
              <td>{s.bloodType}</td>
              <td>{s.units}</td>
              <td>{s.location}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Storage;