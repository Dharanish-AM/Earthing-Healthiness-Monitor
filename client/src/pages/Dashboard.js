import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Account from "../components/Account";
import axios from "axios";
import correct from "../assets/correct.svg"
import warning from "../assets/warning.svg";
function Dashboard() {
  const [empDetails, setEmpDetails] = useState({});
  const [polesStatus, setPoleStatus] = useState([]);
  const [activeTechnicians, setActiveTechnicians] = useState([]);
  const [dayaverage,setdayaverage] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/dashboard", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((response) => {
        console.log(response.data);
        setEmpDetails(response.data.empDetails);
        setPoleStatus(response.data.polesStatus);
        setActiveTechnicians(response.data.activeTechnicians);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [navigate]);

  const errorPoles = polesStatus.filter(poleStatus => poleStatus.status === "Error");
  const activePoles = polesStatus.filter(poleStatus => poleStatus.status === "Active");
  const inactivePoles = polesStatus.filter(poleStatus => poleStatus.status === "Inactive");
  const maintenancePoles = polesStatus.filter(poleStatus => poleStatus.status === "Under Maintenance");

  return (
    <section className="dashboard-container">
      <div className="dashboard-container-header">
        <Header />
      </div>
      <div className="dashboard-container-content">
        <div className="dashboard-container-content-left">
          <div className="dashboard-container-content-left-top">
            <div className="dashboard-container-content-left-top-left">
              <div className="dashboard-container-content-left-top-left-top">
                <div className="dashboard-container-content-left-top-left-top-1">
                  TOTAL NO OF POLES : {polesStatus.length}

                </div>
                <div className="dashboard-container-content-left-top-left-top-2">
                  NO OF ACTIVE POLES : {activePoles.length}
                </div>
                <div className="dashboard-container-content-left-top-left-top-3">
                  NO OF INACTIVE POLES : {inactivePoles.length}
                </div>
              </div>
              <div className="dashboard-container-content-left-top-left-bottom">
                <div className="dashboard-container-content-left-top-left-bottom-text">
                  AVERAGE LEAKAGE CURRENT
                </div>
                <div className="dashboard-container-content-left-top-left-bottom-variable">
                  
                </div>
              </div>
            </div>
            <div className="dashboard-container-content-left-top-right">
              <div className="dashboard-container-content-left-top-right-image-container">
                <div className="dashboard-container-content-left-top-right-image">
                </div>
              </div>
              <div className="dashboard-container-content-left-top-right-text">
                <div>VIEW</div>
                <div>ANALYTICS</div>
              </div>
            </div>
          </div>
          <div className="dashboard-container-content-left-bottom">
            <div className="dashboard-container-content-left-bottom-left">
              <div className="dashboard-container-content-left-bottom-left-activeError">
                ACTIVE ERRORS: {errorPoles.length}
              </div>
              <div className="dashboard-container-content-left-bottom-left-image"
                style={{ backgroundImage: `url(${errorPoles.length > 0 ? warning : correct})` }}>
              </div>
              <div className="dashboard-container-content-left-bottom-left-text">
                <span>NO OF ERRORS: {errorPoles.length}</span>
              </div>
            </div>
            <div className="dashboard-container-content-left-bottom-right">
              <div className="dashboard-container-content-left-bottom-right-technicians">
                TECHNICIANS
              </div>
              <div className="dashboard-container-content-left-bottom-right-count">
                {activeTechnicians.length}
              </div>
              <div className="dashboard-container-content-left-bottom-right-text">
                ACTIVE TECHNICIANS
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-container-content-right">
          <div className="dashboard-container-content-right-profile">
            <div className="dashboard-container-content-right-profile-image">
              
            </div>
            <div className="dashboard-container-content-right-profile-name">
              {empDetails.name}
            </div>
            <div className="dashboard-container-content-right-profile-details" style={{ backgroundColor: "#cccccc" }}>
              <div>
                <span>EMPLOYEE ID : {empDetails.employee_id} </span>
              </div>
              <div>
                <span>EMAIL : {empDetails.email} </span>
              </div>
              <div>
                <span>CONTACT : {empDetails.phone} </span>
              </div>
            </div>
            <div className="dashboard-container-content-right-profile-logout" onClick={()=>{
              localStorage.removeItem('token');
              navigate("/login")
            }}>
              LOGOUT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
