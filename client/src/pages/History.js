// History.js
import "../App.css";
import { useState } from "react";
import Header from "../components/Header";
import Account from "../components/Account";

const sampleData = [
    {
        id: 1,
        sensorName: 'Sensor A',
        sensorId: 'S123',
        location: 'Building 1',
        time: '2024-08-21 14:30',
        fixingStatus: 'Fixed',
        technician: 'Ram'
    },
    {
        id: 2,
        sensorName: 'Sensor B',
        sensorId: 'S456',
        location: 'Building 2',
        time: '2024-08-21 15:00',
        fixingStatus: 'Pending',
        technician: 'Rohith'
    },
    {
        id: 3,
        sensorName: 'Sensor C',
        sensorId: 'S789',
        location: 'Building 3',
        time: '2024-08-21 16:00',
        fixingStatus: 'Fixed',
        technician: 'Kumar'
    },
    {
        id: 4,
        sensorName: 'Sensor D',
        sensorId: 'S101',
        location: 'Building 4',
        time: '2024-08-21 17:30',
        fixingStatus: 'Pending',
        technician: 'Arun'
    },
    {
        id: 5,
        sensorName: 'Sensor E',
        sensorId: 'S202',
        location: 'Building 5',
        time: '2024-08-21 18:00',
        fixingStatus: 'Fixed',
        technician: 'Karthik'
    },
    {
        id: 6,
        sensorName: 'Sensor F',
        sensorId: 'S303',
        location: 'Building 6',
        time: '2024-08-21 19:00',
        fixingStatus: 'Pending',
        technician: 'Rajesh'
    }
];


function History() {
    const [profile, setProfile] = useState(false);

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }

    return (
        <div>
            <Header onProfileClick={handleProfileClick} />
            {profile && (
                <>
                    <div className="profile-backdrop" onClick={handleCloseProfile}></div>
                    <Account onClose={handleCloseProfile} />
                </>
            )}

            <div className="history-container">
                <h1>Recent Leakage History</h1>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Sensor Name</th>
                            <th>Sensor ID</th>
                            <th>Location</th>
                            <th>Time</th>
                            <th>Fixing Status</th>
                            <th>Technician</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.sensorName}</td>
                                <td>{item.sensorId}</td>
                                <td>{item.location}</td>
                                <td>{item.time}</td>
                                <td>{item.fixingStatus}</td>
                                <td>{item.technician}</td>
                                <td>
                                    <button className="view-button">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;
