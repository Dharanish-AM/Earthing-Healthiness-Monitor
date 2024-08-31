import { useEffect, useState } from "react";
import "../App.css";
import Header from "../components/Header";
import axios from "axios";

function History() {
  const [polesDetails, setPolesDetails] = useState([]);

  useEffect(() => {
    const fetchPolesDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getAllPoleDetails"
        );
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setPolesDetails(response.data.data);
        } else {
          console.warn("Unexpected response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching all pole details:", error);
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
          <ul>
            {polesDetails.map((poledetails) => (
              <li key={poledetails.pole_id}>
                <h2>Pole ID: {poledetails.pole_id}</h2>
                <p>Status: {poledetails.status}</p>
                <p>Location: {poledetails.location}</p>
                <p>Coordinates:</p>
                <ul>
                  <li>Latitude: {poledetails.coordinates[0]}</li>
                  <li>Longitude: {poledetails.coordinates[1]}</li>
                </ul>
                <p>Last Maintenance: {poledetails.last_maintenance || "N/A"}</p>
                <p>Day Average:</p>
                <ul>
                  {poledetails.day_average &&
                  poledetails.day_average.length > 0 ? (
                    poledetails.day_average.map((day, index) => (
                      <li key={index}>
                        {typeof day === "object"
                          ? `Time: ${day.time}, Current: ${day.current}, ID: ${day._id}`
                          : `Day ${index + 1}: ${day}`}
                      </li>
                    ))
                  ) : (
                    <li>No data available</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pole details available.</p>
        )}
      </div>
    </div>
  );
}

export default History;
