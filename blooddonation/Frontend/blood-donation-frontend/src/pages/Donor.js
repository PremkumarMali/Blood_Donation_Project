import { useEffect, useState } from "react";
import axios from "axios";

function Donor() {

  const [donors, setDonors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    contact: "",
    address: ""
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    const res = await axios.get("http://localhost:8080/api/donors");
    setDonors(res.data);
  };

  const editDonor = (donor) => {
    setFormData({
      name: donor.name,
      age: donor.age,
      bloodType: donor.bloodType,
      contact: donor.contact,
      address: donor.address
    });

    setEditingId(donor.donor_id);
  };

  const deleteDonor = async (id) => {
    await axios.delete(`http://localhost:8080/api/donors/${id}`);
    fetchDonors();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`http://localhost:8080/api/donors/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:8080/api/donors", formData);
    }

    fetchDonors();

    setFormData({
      name: "",
      age: "",
      bloodType: "",
      contact: "",
      address: ""
    });
  };

return (
  <div className="container mt-4">

    <h2 className="mb-3">Add Donor</h2>

    <form onSubmit={handleSubmit} className="row g-3">

      <div className="col-md-4">
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-2">
        <input
          type="number"
          className="form-control"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          name="bloodType"
          placeholder="Blood Type"
          value={formData.bloodType}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="col-12">
        <button className="btn btn-primary">
          {editingId ? "Update Donor" : "Add Donor"}
        </button>
      </div>

    </form>

    <hr />

    <h2 className="mb-3">Donor List</h2>

    <table className="table table-bordered">

      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Blood Type</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {donors.map((d) => (
          <tr key={d.donor_id}>
            <td>{d.name}</td>
            <td>{d.age}</td>
            <td>{d.bloodType}</td>
            <td>{d.contact}</td>
            <td>{d.address}</td>

            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editDonor(d)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteDonor(d.donor_id)}
              >
                Delete
              </button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>

  </div>
);
}

export default Donor;