import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Account from "../components/Account";

function Dashboard() {
    // eslint-disable-next-line no-unused-vars
    const [details, setDetails] = useState([
        { id: 1, name: 'Sensor 1', status: false, location: 'Room 101' },
        { id: 2, name: 'Sensor 2', status: true, location: 'Room 102' },
        { id: 3, name: 'Sensor 3', status: false, location: 'Room 103' },
        { id: 4, name: 'Sensor 4', status: false, location: 'Room 104' },
        { id: 5, name: 'Sensor 5', status: true, location: 'Room 105' },
        { id: 6, name: 'Sensor 6', status: false, location: 'Room 106' },
        { id: 7, name: 'Sensor 7', status: false, location: 'Room 107' },
        { id: 8, name: 'Sensor 8', status: false, location: 'Room 108' },
        { id: 9, name: 'Sensor 9', status: false, location: 'Room 109' }
    ]);
    const [profile, setProfile] = useState(false);
    const navigate = useNavigate();
    const [managesensorsbtn, setManageSensorbtn] = useState(false)

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }

    function routeCompo(id) {
        console.log(id);
        navigate(`/home/details?sensorid=${id}`);
    }

    function handleManageTechnician() {
        navigate('home/manage-technicians');
    }

    function manageSensorsclick() {
        setManageSensorbtn(!managesensorsbtn)
        console.log(managesensorsbtn)
        navigate("/home/manage-sensors")
    }


    return (
        <div className="dashboard-container">
            <Header onProfileClick={handleProfileClick} />
            <div className="dashboard-main">
                <div className="dashboard-toolbar">
                    <p className="dashboard-main-title">Dashboard</p>
                    <button onClick={manageSensorsclick} className="manage-technician-btn" style={{ marginLeft: "60%" }}>Manage Sensors</button>
                    <button
                        className="manage-technician-btn"
                        onClick={handleManageTechnician}
                    >
                        Manage Technicians
                    </button>
                </div>
                <div className="dashboard-grid">
                    {details.map((detail) => (
                        <div
                            key={detail.id}
                            className="grid-item"
                            onClick={() => routeCompo(detail.id)}
                        >
                            <p className="sensor-name">{detail.name}</p>
                            <p className={`sensor-status ${detail.status ? 'leakage' : 'no-leakage'}`}>
                                Status: {detail.status ? 'Leakage Detected' : 'No Leakage'}
                            </p>
                            <p className="sensor-location">Location: {detail.location}</p>
                        </div>
                    ))}
                </div>
            </div>
            {profile && (
                <>
                    <div className="profile-backdrop" onClick={handleCloseProfile}></div>
                    <Account onClose={handleCloseProfile} />
                </>
            )}
        </div>
    );
}

export default Dashboard;
