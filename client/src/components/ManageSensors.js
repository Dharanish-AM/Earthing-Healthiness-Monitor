import "../App.css";
import { useState } from "react";
import Header from "./Header";
import Account from "./Account";

function ManageSensors() {
    const [profile, setProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sensors, setSensors] = useState([
        { id: 1, name: 'Sensor 1', location: 'Room-101' },
        { id: 2, name: 'Sensor 2', location: 'Room-102' },
        { id: 3, name: 'Sensor 3', location: 'Room-103' },
    ]);

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }

    function handleView(sensorId) {
        console.log(`View details for sensor ID: ${sensorId}`);
    }

    function handleEdit(sensorId) {
        console.log(`Edit sensor ID: ${sensorId}`);
    }

    function handleDelete(sensorId) {
        console.log(`Delete sensor ID: ${sensorId}`);
        setSensors(sensors.filter(sensor => sensor.id !== sensorId));
    }

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    const filteredSensors = sensors.filter(sensor =>
        sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="manage-sensors-container">
            <Header onProfileClick={handleProfileClick} />
            <div className="manage-sensor-main">
                {profile && (
                    <>
                        <div className="profile-backdrop" onClick={handleCloseProfile}></div>
                        <Account onClose={handleCloseProfile} />
                    </>
                )}
                <h2>Manage Sensors</h2>
                <input
                    type="text"
                    placeholder="Search Sensors..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {filteredSensors.map(sensor => (
                    <div key={sensor.id} className="sensor-thumbnail">
                        <div className="sensor-id-name">
                            <p><span style={{ fontWeight: "550" }}>Sensor ID: </span>{sensor.id}</p>
                            <p><span style={{ fontWeight: "550" }}>Sensor Name: </span>{sensor.name}</p>
                            <p><span style={{ fontWeight: "550" }}>Sensor Location: </span>{sensor.location}</p>
                        </div>
                        <div className="sensor-actions">
                            <button className="view-button" onClick={() => handleView(sensor.id)}>View</button>
                            <button className="edit-button" onClick={() => handleEdit(sensor.id)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(sensor.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageSensors;
