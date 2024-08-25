import "../App.css";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { useState, useEffect } from "react";
import Account from "./Account";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import mapcurrpin from "../assets/icons8-current-location-48.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js/auto";
import { Line } from "react-chartjs-2";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

function Details() {
    const [query] = useSearchParams();
    const [profile, setProfile] = useState(false);
    const [position, setPosition] = useState(null);
    const [sensorDetails] = useState({
        sensorId: "213557985",
        sensorName: "Sensor-Godown",
        sensorType: "CT Sensor",
        sensorLocation: "Coimbatore",
        sensorStatus: "No Leakage",
        sensorValue: "0.43A",
        sensorUnit: "Ampere",
        sensorDescription: "SCT-013",
        sensorImage: "None",
        sensorfitDate: "23-8-2024",
    });

    // Use Effect for tracking the position
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                console.error(err);
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId); // Cleanup the watch on unmount
    }, []);

    const customIcon = new L.Icon({
        iconUrl: mapcurrpin,
        iconSize: [40, 40],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
    });

    const sensorid = query.get("sensorid");
    console.log(sensorid);

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }

    const data = {
        labels: ["8:00", "9:00", "10:00", "11:00", "12:00"],
        datasets: [
            {
                label: "Sensor Value",
                data: [0.35, 0.4, 0.43, 0.5, 0.6, 0.55, 0.62],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(0, 123, 255, 1)",
                pointBackgroundColor: "rgba(220, 53, 69, 1)",
                pointBorderColor: "#fff",
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "TimeStamp",
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: "Sensor Value (Ampere)",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="sensor-details-container">
            <Header onProfileClick={handleProfileClick} />
            <div className="sensor-details-main">
                <p className="sensor-details-title">Sensor Details</p>
                <div className="sensor-details-card">
                    <div className="sensor-details-card-header">
                        <div>
                            <p><span>Sensor ID:</span> {sensorDetails.sensorId}</p>
                            <p><span>Sensor Name:</span> {sensorDetails.sensorName}</p>
                            <p><span>Sensor Type:</span> {sensorDetails.sensorType}</p>
                            <p><span>Sensor Location:</span> {sensorDetails.sensorLocation}</p>
                            <p><span>Sensor Status:</span> {sensorDetails.sensorStatus}</p>
                            <p><span>Sensor Value:</span> {sensorDetails.sensorValue}</p>
                            <p><span>Sensor Unit:</span> {sensorDetails.sensorUnit}</p>
                            <p><span>Sensor Description:</span> {sensorDetails.sensorDescription}</p>
                            <p><span>Sensor Fitted Date:</span> {sensorDetails.sensorfitDate}</p>
                        </div>
                        {position && (
                            <MapContainer center={position} zoom={16} style={{ height: "370px", width: "40%" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={position} icon={customIcon}>
                                    <Popup>You are here</Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </div>
                    <div className="chart-container">
                        <Line data={data} options={options} />
                    </div>
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

export default Details;
