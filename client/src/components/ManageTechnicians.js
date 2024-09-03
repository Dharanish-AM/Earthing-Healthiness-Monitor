import { useEffect, useState } from "react";
import "../App.css";
import Header from "./Header";
import Account from "./Account";
import axios from "axios";

function ManageTechnicians() {
  const [AllTechnicians, setAllTechnicians] = useState([]);

  useEffect(() => {
    const technicians = axios
      .get("http://localhost:8000/technicians")
      .then((response) => {
        setAllTechnicians(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  },[]);

  return (
    <div className="technicians-page-container">
      <div className="technicians-page-container-header">
        <Header />
      </div>
      <div className="technicians-page-container-content">
        <h1>Manage Technicians</h1>
      </div>
    </div>
  );
}

export default ManageTechnicians;
