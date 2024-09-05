import { useState, useEffect } from "react";
import "../App.css";
import Header from "../components/Header";
import axios from "axios";
import TechnicianPopup from "../components/TechnicianPopup";
import * as XLSX from "xlsx";

function History() {
  const [polesDetails, setPolesDetails] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPoleId, setSelectedPoleId] = useState(null);
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [showTechnicianDetails, setShowTechnicianDetails] = useState(false);

  useEffect(() => {
    const fetchPolesDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/gethistoryinfo"
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          setPolesDetails(response.data.data);
        } else {
          console.warn("Unexpected response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching pole details:", error);
      }
    };

    fetchPolesDetails();
    const intervalId = setInterval(fetchPolesDetails, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAssignTechnician = (poleId, technicianId) => {
    if (technicianId && technicianId !== "not-assigned") {
      alert("This pole already has a technician assigned.");
      return;
    }
    setSelectedPoleId(poleId);
    setShowPopup(true);
  };

  const handleViewDetails = (poleId) => {
    console.log(`View details for pole ${poleId}`);
  };

  const handleShowTechnicianDetails = async (technicianId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/gettechniciandetails/${technicianId}`
      );
      console.log('Technician Details Response:', response.data);
      setTechnicianDetails(response.data.data);
      setShowTechnicianDetails(true);
    } catch (error) {
      console.error("Error fetching technician details:", error);
    }
  };

  const handleDownloadReport = () => {
    const headers = [
      { header: "Pole ID", key: "pole_id" },
      { header: "Status", key: "status" },
      { header: "Date & Time", key: "date_time" },
      { header: "Technician ID", key: "technician_id" },
      { header: "Severity", key: "severity" },
      { header: "Repaired On", key: "repaired_on" },
      { header: "Description", key: "description" },
    ];

    const formattedData = polesDetails.map((detail) => ({
      pole_id: detail.pole_id,
      status: detail.status,
      date_time: new Date(detail.date_time).toLocaleString(),
      technician_id: detail.technician_id || "N/A",
      severity: detail.severity || "N/A",
      repaired_on: detail.repaired_on
        ? new Date(detail.repaired_on).toLocaleString()
        : "N/A",
      description: detail.description || "No description",
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData, {
      header: headers.map((h) => h.key),
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "History");

    XLSX.writeFile(wb, "History.xlsx");
  };

  return (
    <div className="history-page-container">
      <div className="history-page-header">
        <Header />
      </div>
      <div className="history-page-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>History</h1>
          <button
            className="download-report-button"
            onClick={handleDownloadReport}
          >
            Download Report
          </button>
        </div>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {polesDetails.map((historyDetail) => (
                <tr key={historyDetail._id}>
                  <td>{historyDetail.pole_id}</td>
                  <td>{historyDetail.status}</td>
                  <td>{new Date(historyDetail.date_time).toLocaleString()}</td>
                  <td>{historyDetail.technician_id || "N/A"}</td>
                  <td>{historyDetail.severity || "N/A"}</td>
                  <td>
                    {historyDetail.repaired_on
                      ? new Date(historyDetail.repaired_on).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{historyDetail.description || "No description"}</td>
                  <td>
                    {historyDetail.status === "Pending" &&
                      historyDetail.technician_id === "not-assigned" && (
                        <button
                          className="assign-technician-button"
                          onClick={() =>
                            handleAssignTechnician(
                              historyDetail.pole_id,
                              historyDetail.technician_id
                            )
                          }
                        >
                          Assign Technician
                        </button>
                      )}
                    {historyDetail.status === "In Progress" &&
                      historyDetail.technician_id && (
                        <button
                          className="in-progress-button"
                          onClick={() => {
                            console.log("Technician ID:", historyDetail.technician_id);
                            handleShowTechnicianDetails(
                              historyDetail.technician_id
                            );
                          }}
                        >
                          Show Technician Details
                        </button>
                      )}
                    {historyDetail.status === "Fixed" && (
                      <button
                        className="view-details-button"
                        onClick={() => handleViewDetails(historyDetail.pole_id)}
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No poles with errors available.</p>
        )}
      </div>
      {showPopup && (
        <TechnicianPopup
          poleId={selectedPoleId}
          onClose={() => setShowPopup(false)}
        />
      )}
      {showTechnicianDetails && technicianDetails && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Technician Details</h2>
            <p>
              <span style={{ fontWeight: "600" }}>ID:</span>
              <span style={{ fontWeight: 500, marginLeft: "5px" }}>
                {technicianDetails.technician_id}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Name:</span>
              <span style={{ fontWeight: 500, marginLeft: "5px" }}>
                {technicianDetails.name}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Email:</span>
              <span style={{ fontWeight: 500, marginLeft: "5px" }}>
                {technicianDetails.email}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Address:</span>
              <span style={{ fontWeight: 500, marginLeft: "5px" }}>
                {technicianDetails.address}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Phone:</span>
              <span style={{ fontWeight: 500, marginLeft: "5px" }}>
                {technicianDetails.phone}
              </span>
            </p>
            <button onClick={() => setShowTechnicianDetails(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
