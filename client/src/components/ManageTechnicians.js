import { useEffect, useState } from "react";
import "../App.css";
import Header from "./Header";
import axios from "axios";

function ManageTechnicians() {
  const [allTechnicians, setAllTechnicians] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/technicians")
      .then((response) => {
        if (Array.isArray(response.data.technicians)) {
          setAllTechnicians(response.data.technicians);
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching technicians:", error);
      });
  }, []);

  return (
    <div className="technicians-page-container">
      <div className="technicians-page-header">
        <Header />
      </div>
      <div className="technicians-page-content">
        <h1 style={{ marginLeft: "15px" }}>Manage Technicians</h1>
        {Array.isArray(allTechnicians) && allTechnicians.length > 0 ? (
          <table className="technicians-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Age</th>
                <th>Status</th>
                <th>History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTechnicians.map((technician) => (
                <tr key={technician.technician_id}>
                  <td>{technician.technician_id}</td>
                  <td>{technician.name}</td>
                  <td>{technician.email}</td>
                  <td>{technician.phone}</td>
                  <td>{technician.address}</td>
                  <td>{technician.age}</td>
                  <td>{technician.active ? "Active" : "Inactive"}</td>
                  <td>{technician.history}</td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No technicians available.</p>
        )}
      </div>
    </div>
  );
}

export default ManageTechnicians;
