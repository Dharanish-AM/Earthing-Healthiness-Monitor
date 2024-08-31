import "../App.css";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router";
import mapcurrpin from "../assets/icons8-current-location-48.png";
import L from "leaflet";
import axios from "axios";

function Map() {
  const [polesDetails, setpolesDetails] = useState([]);
  const navigate = useNavigate();
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    const fetchPoleDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getpolesdetailsmap"
        );
        setpolesDetails(response.data.polesdata);
      } catch (error) {
        console.error("Error fetching poles details:", error);
      }
    };

    fetchPoleDetails();
  }, [navigate]);

  function viewPoleonMap(cords) {
    console.log(cords);
  }

  function showPoleDetails(pole_id) {
    console.log(pole_id);
    navigate(`/details?poleid=${pole_id}`);
  }

  return (
    <section className="map-page-container">
      <div className="map-page-container-header">
        <Header />
      </div>
      <div className="map-page-container-content">
        <div className="map-page-container-content-left">
          <div className="map-page-container-content-search">
            <input type="text" placeholder="Enter Pole ID to find" />
          </div>
          <div className="map-page-container-content-poleslist">
            {polesDetails.map((pole) => (
              <div key={pole.pole_id || `pole-${pole.pole_id}`}>
                <p>Pole ID: {pole.pole_id}</p>
                <p>Status: {pole.status}</p>
                <p>Location: {pole.location}</p>
                <button onClick={() => viewPoleonMap(pole.coordinates)}>
                  View
                </button>
                <button onClick={() => showPoleDetails(pole.pole_id)}>
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="map-page-container-content-right">
          <div className="leaflet-container">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;
