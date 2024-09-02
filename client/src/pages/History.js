import { useEffect, useState } from "react";
import "../App.css";
import Header from "../components/Header";
import axios from "axios";

function History() {
  const [polesDetails, setPolesDetails] = useState([]);

    useEffect(() => {
      const fetchPolesDetails = async () => {
        try {
          const response = await axios.get("http://localhost:8000/gethistoryinfo");
          if (response.data && Array.isArray(response.data.data)) {
            setPolesDetails(response.data.data);
            console.log(response.data)
          } else {
            console.warn("Unexpected response data:", response.data);
          }
        } catch (error) {
          console.error("Error fetching pole details:", error);
        }
      };
  
      fetchPolesDetails();
    }, []);
  

  return (
    <div className="history-page-container">
      <div className="history-page-header">
        <Header />
      </div>
      <div className="history-page-content">
        <h1>History</h1>
        {polesDetails.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Pole ID</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Technician ID</th>
                <th>Severity</th>
                <th>Repaired On</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {polesDetails.map((historyDetail) => (
                <tr key={historyDetail._id}>
                  <td>{historyDetail.pole_id}</td>
                  <td>{historyDetail.status}</td>
                  <td>{new Date(historyDetail.date_time).toLocaleString()}</td>
                  <td>{historyDetail.technician_id}</td>
                  <td>{historyDetail.severity || "N/A"}</td>
                  <td>{historyDetail.repaired_on ? new Date(historyDetail.repaired_on).toLocaleString() : "N/A"}</td>
                  <td>{historyDetail.description || "No description"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No poles with errors available.</p>
        )}
      </div>
    </div>
  );
}

export default History;
