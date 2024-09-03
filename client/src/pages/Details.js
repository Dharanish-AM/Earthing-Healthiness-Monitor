import { useEffect, useState } from "react";
import "../App.css";
import Header from "../components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Details() {
  const [searchParams] = useSearchParams();
  const poleid = searchParams.get("poleid");
  const [allPolesDetails, setAllPolesDetails] = useState([]);
  const [onePoleDetails, setOnePoleDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllPolesDetails() {
      try {
        const response = await axios.get(
          "http://localhost:8000/getAllPoleDetails"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setAllPolesDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching all pole details:", error);
      }
    }

    async function fetchOnePoleDetails(poleid) {
      try {
        const response = await axios.get(
          "http://localhost:8000/getpoledeatils",
          {
            params: { poleid },
          }
        );
        setOnePoleDetails(response.data);
      } catch (error) {
        console.error("Error fetching one pole details:", error);
      }
    }

    if (poleid) {
      fetchOnePoleDetails(poleid);
    } else {
      fetchAllPolesDetails();
    }
  }, [poleid]);

  function poleClicked(pole) {
    navigate(`/dashboard/poles?poleid=${pole.pole_id}`);
  }

  const renderObject = (obj) => {
    if (typeof obj === "object") {
      return JSON.stringify(obj);
    }
    return obj;
  };

  function getTimeString(time) {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  const getLastDayAverage = (dayAverage) => {
    if (Array.isArray(dayAverage) && dayAverage.length > 0) {
      const lastEntry = dayAverage[dayAverage.length - 1];
      return (
        <p>
          <strong>Current:</strong> {lastEntry.current} <br />
          <strong>Time:</strong> {getTimeString(lastEntry.time)}
        </p>
      );
    }
    return "N/A"; 
  };

  return (
    <div className="details-page-container">
      <div className="details-page-container-header">
        <Header />
      </div>
      <div className="details-page-content">
        {poleid ? (
          <>
            <h1>Details of Pole {poleid}</h1>
            {onePoleDetails ? (
              <div className="pole-details">
                <p>
                  <strong>Pole ID:</strong> {onePoleDetails.pole_id}
                </p>
                <p>
                  <strong>Status:</strong> {onePoleDetails.status}
                </p>
                <p>
                  <strong>Location:</strong> {onePoleDetails.location}
                </p>
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {renderObject(onePoleDetails.coordinates)}
                </p>
                <p>
                  <strong>Last Maintenance:</strong>{" "}
                  {onePoleDetails.last_maintenance == null
                    ? "N/A"
                    : onePoleDetails.last_maintenance}
                </p>
                <p>
                  <strong>Day Average:</strong>{" "}
                  {getLastDayAverage(onePoleDetails.day_average)}
                </p>
              </div>
            ) : (
              <p>No details found for Pole {poleid}</p>
            )}
          </>
        ) : (
          <>
            <h1>All Pole Details</h1>
            <ul className="pole-list">
              {allPolesDetails.map((pole) => (
                <li
                  onClick={() => poleClicked(pole)}
                  key={pole.pole_id}
                  className="pole-item"
                >
                  <p>
                    <strong>Pole ID:</strong> {pole.pole_id}
                  </p>
                  <p>
                    <strong>Status:</strong> {pole.status}
                  </p>
                  <p>
                    <strong>Location:</strong> {pole.location}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Details;
