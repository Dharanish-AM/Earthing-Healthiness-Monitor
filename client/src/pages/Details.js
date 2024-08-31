import { useEffect, useState } from "react";
import "../App.css";
import Header from "../components/Header";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function Details() {
  const [searchParams] = useSearchParams();
  const poleid = searchParams.get("poleid");
  const [allPolesDetails, setAllPolesDetails] = useState([]);
  const [onePoleDetails, setOnePoleDetails] = useState(null);

  useEffect(() => {
    async function fetchAllPolesDetails() {
      try {
        const response = await axios.get(
          "http://localhost:8000/getAllPoleDetails"
        );
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
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
        console.log(response.data);
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

  return (
    <div className="details-page-container">
      <div className="details-page-header">
        <Header />
      </div>
      <div className="details-page-content">
        {poleid ? (
          <div className="details-page-content-unique-poledetails">
            <h1>Details of Pole {poleid}</h1>
            {onePoleDetails ? (
              <>
                <p>Pole ID: {onePoleDetails.pole_id}</p>
                <p>Status: {onePoleDetails.status}</p>
                <p>Location: {onePoleDetails.location}</p>
              </>
            ) : (
              <p>No details found for Pole {poleid}</p>
            )}
          </div>
        ) : (
          <div className="details-page-content-all-poledetails">
            <h1>All Pole Details</h1>
            <ul>
              {allPolesDetails.map((pole) => (
                <li key={pole.pole_id}>
                  <p>Pole ID: {pole.pole_id}</p>
                  <p>Status: {pole.status}</p>
                  <p>Location: {pole.location}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
