import { useState } from "react";
import axios from "axios";

function FindDonor(){

  const [blood,setBlood] = useState("");
  const [donors,setDonors] = useState([]);

  const searchDonor = async () => {

    try{

      const res = await axios.get(
        `http://localhost:8080/api/donors/blood/${encodeURIComponent(blood)}`
      );

      setDonors(res.data);

    }catch(error){
      console.error(error);
      alert("Error finding donors");
    }
  };

  return(
    <div className="container mt-4">

      <h2>Find Donor</h2>

      <input
        className="form-control"
        placeholder="Enter Blood Group"
        onChange={(e)=>setBlood(e.target.value)}
      />

      <button
        className="btn btn-primary mt-2"
        onClick={searchDonor}
      >
        Search
      </button>

      <table className="table mt-4">

        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Blood Type</th>
            <th>Contact</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>

        {donors.map(d=>(
          <tr key={d.donor_id}>
            <td>{d.name}</td>
            <td>{d.bloodType}</td>
            <td>{d.contact}</td>
            <td>{d.address}</td>
          </tr>
        ))}

        </tbody>

      </table>

    </div>
  )
}

export default FindDonor;