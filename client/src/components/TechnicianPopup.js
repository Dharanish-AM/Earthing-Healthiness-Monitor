import { useState, useEffect } from "react";
import axios from "axios";

function TechnicianPopup({ poleId, onClose }) {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getactivetechnicians"
        );
        setTechnicians(response.data.technicians);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  const handleAssignTechnician = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/assigntechnician",
        {
          poleId,
          technicianId: selectedTechnicianId,
          status: "In Progress", // Automatically set status to "In Progress"
          description: null, // Set description to null if not provided
        }
      );
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician. Please try again.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Assign Technician</h2>
        <select
          value={selectedTechnicianId}
          onChange={(e) => setSelectedTechnicianId(e.target.value)}
        >
          <option value="">Select Technician</option>
          {technicians.map((tech) => (
            <option key={tech._id} value={tech.technician_id}>
              {tech.name} - {tech.technician_id}
            </option>
          ))}
        </select>
        <button onClick={handleAssignTechnician}>Assign</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default TechnicianPopup;
