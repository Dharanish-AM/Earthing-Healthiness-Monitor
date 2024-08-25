import "../App.css";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Account from "../components/Account";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router";
import mapcurrpin from "../assets/icons8-current-location-48.png";
import L from "leaflet";

function Map() {
    const [profile, setProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [components] = useState([
        "Component1", "Component2", "Component3", 
        "Component4", "Component5", "Component6", 
        "Component8", "Component9", "Component10"
    ]);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    setError("Failed to fetch location");
                    setLoading(false);
                }
            );
        };

        const intervalId = setInterval(updatePosition, 0); // Update every 10 seconds
        return () => clearInterval(intervalId);
    }, []);

    const customIcon = new L.Icon({
        iconUrl: mapcurrpin,
        iconSize: [40, 40],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
    });

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    const filteredComponents = components.filter(component =>
        component.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleViewClick(sensorId) {
        navigate(`/home/details?sensorid=${sensorId}`);
    }

    return (
        <div className="map-container">
            <Header onProfileClick={handleProfileClick} />
            {profile && (
                <>
                    <div className="profile-backdrop" onClick={handleCloseProfile}></div>
                    <Account onClose={handleCloseProfile} />
                </>
            )}
            <div className="map-main-container">
                <div className="map-leftside">
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                        aria-label="Search components"
                    />
                    <ul className="component-list">
                        {filteredComponents.map((component, index) => (
                            <li key={index} className="component-item">
                                {component}
                                <button onClick={() => handleViewClick(component)}>
                                    View
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="map-rightside">
                    {loading && <p>Loading location...</p>}
                    {error && <p>{error}</p>}
                    {position && !loading && !error && (
                        <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
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
            </div>
        </div>
    );
}

export default Map;
