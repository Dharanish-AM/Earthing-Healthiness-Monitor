import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router";
import L from "leaflet"; 
import pin from "../assets/pin.png";  
import axios from "axios";

const customIcon = L.icon({
  iconUrl: pin,
  iconSize: [32, 32],  
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32]  
});

const MapViewControl = ({ position, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);

  return null;
};

function Map() {
  const [polesDetails, setpolesDetails] = useState([]);
  const [selectedPoleId, setSelectedPoleId] = useState(null);
  const navigate = useNavigate();
  const [position, setPosition] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(12);
  const markerRefs = useRef({});

  useEffect(() => {
    const fetchPoleDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/getpolesdetailsmap"
        );
        setpolesDetails(response.data.polesdata);

        if (response.data.polesdata.length > 0) {
          setPosition(response.data.polesdata[0].coordinates);
        }
      } catch (error) {
        console.error("Error fetching poles details:", error);
      }
    };

    fetchPoleDetails();

    const intervalId = setInterval(fetchPoleDetails, 5000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  function viewPoleonMap(cords, poleId) {
    setPosition(cords);
    setZoom(17);
    setSelectedPoleId(poleId);
  }

  function showPoleDetails(pole_id) {
    navigate(`/dashboard/poles?poleid=${pole_id}`);
  }

  useEffect(() => {
    if (selectedPoleId && markerRefs.current[selectedPoleId]) {
      markerRefs.current[selectedPoleId].openPopup();
    }
  }, [selectedPoleId]);

  return (
    <section className="map-page-container">
      <div className="map-page-container-header">
        <Header />
      </div>
      <div className="map-page-container-content">
        <div className="map-page-container-content-left">
          <div className="map-page-container-content-left-search">
            <input type="text" placeholder="Enter Pole ID to find" />
          </div>
          <div className="map-page-container-content-left-poleslist">
            {polesDetails.map((pole) => (
              <div key={pole.pole_id || `pole-${pole.pole_id}`}>
                <p>Pole ID: {pole.pole_id}</p>
                <p>Status: {pole.status}</p>
                <p>Location: {pole.location}</p>
                <button onClick={() => viewPoleonMap(pole.coordinates, pole.pole_id)}>
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
          <div className="leaflet-container" style={{ height: "100%", width: "100%" }}>
            <MapContainer
              center={position}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {polesDetails.map((pole) => (
                <Marker
                  key={pole.pole_id}
                  position={pole.coordinates}
                  icon={customIcon}
                  ref={(el) => (markerRefs.current[pole.pole_id] = el)}
                >
                  <Popup>
                    <div>
                      <p>Pole ID: {pole.pole_id}</p>
                      <p>Status: {pole.status}</p>
                      <p>Location: {pole.location}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapViewControl position={position} zoom={zoom} />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;
