import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Account from "../components/Account";
import axios from "axios";
import correct from "../assets/correct.svg";
import warning from "../assets/warning.svg";
import analytics from "../assets/analytics.png";
function Dashboard() {
  const [empDetails, setEmpDetails] = useState({});
  const [polesStatus, setPoleStatus] = useState([]);
  const [activeTechnicians, setActiveTechnicians] = useState([]);
  const [dayaverage, setdayaverage] = useState([]);
  const [averageLeakageCurrent, setAverageLeakageCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setEmpDetails(response.data.empDetails);
        setPoleStatus(response.data.polesStatus);
        setActiveTechnicians(response.data.activeTechnicians);
        avgLeakageCurrent(response.data.polesStatus);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [navigate]);

  const errorPoles = polesStatus.filter(
    (poleStatus) => poleStatus.status === "Error"
  );
  const activePoles = polesStatus.filter(
    (poleStatus) => poleStatus.status === "Active"
  );
  const inactivePoles = polesStatus.filter(
    (poleStatus) => poleStatus.status === "Inactive"
  );
  const maintenancePoles = polesStatus.filter(
    (poleStatus) => poleStatus.status === "Under Maintenance"
  );
  function avgLeakageCurrent(polesStatus) {
    let totalLeakageCurrent = 0;
    let count = 0;
    polesStatus.forEach((pole) => {
      const { day_average } = pole;
      if (day_average.length > 0) {
        totalLeakageCurrent += day_average.reduce((_, value, index, array) =>
          index === array.length - 1 ? value : _
        , 0);
        count++;
      }
    });

    const average = count > 0 ? totalLeakageCurrent / count : 0;
    setAverageLeakageCurrent(average);
  }

  return (
    <section className="dashboard-container">
      <div className="dashboard-container-header">
        <Header />
      </div>
      <div className="dashboard-container-content">
        <div className="dashboard-container-content-top">
          <div className="dashboard-container-content-top-overview">
            <div className="dashboard-container-content-top-overview-error">
              <div className="dashboard-container-content-top-overview-error-heading">
                ACTIVE ERRORS
              </div>
              <div className="dashboard-container-content-top-overview-error-image" 
                   style={{backgroundImage : `url(${(errorPoles.length === 0) ? correct : warning})`}}
              ></div>
              <div className="dashboard-container-content-top-overview-error-text">
                NO OF ERRORS : <b>{errorPoles.length}</b>
              </div>
            </div>
            <div className="dashboard-container-content-top-overview-technician">
              <div className="dashboard-container-content-top-overview-technician-heading">
                ACTIVE TECHNICIAN
              </div>
              <div className="dashboard-container-content-top-overview-technician-count">
                {activeTechnicians.length}
              </div>
              <div className="dashboard-container-content-top-overview-technician-text">
                NO OF TECHNICIANS
              </div>
            </div>
          </div>
          <div className="dashboard-container-content-top-profile">
            <div className="dashboard-container-content-top-profile-name">
              {empDetails.name}
            </div>
            <div className="dashboard-container-content-top-profile-details">
              <div className="dashboard-container-content-top-profile-details-id">
                <b>EMP_ID</b> : {empDetails.employee_id}
              </div>
              <div className="dashboard-container-content-top-profile-details-email">
                <b>EMAIL</b> : {empDetails.email}
              </div>
              <div className="dashboard-container-content-top-profile-details-contact">
                <b>CONTACT</b> : {empDetails.phone}
              </div>
            </div>
            <div className="dashboard-container-content-top-profile-logout">LOGOUT</div>
          </div>
        </div>
        <div className="dashboard-container-content-bottom">
          <div className="dashboard-container-content-bottom-container">
            <div className="dashboard-container-content-bottom-container-stats">
              <div className="dashboard-container-content-bottom-container-stats-poles">
                <div className="dashboard-container-content-bottom-container-stats-poles-total">TOTAL NO OF POLES : <b>{polesStatus.length}</b></div>
                <div className="dashboard-container-content-bottom-container-stats-poles-active">NO OF ACTIVE POLES : <b>{activePoles.length}</b></div>
                <div className="dashboard-container-content-bottom-container-stats-poles-inactive">NO OF INACTIVE POLES : <b>{inactivePoles.length}</b></div>
              </div>
              <div className="dashboard-container-content-bottom-container-stats-current">
                <div className="dashboard-container-content-bottom-container-stats-current-heading">AVERAGE LEAKAGE CURRENT</div>
                <div className="dashboard-container-content-bottom-container-stats-current-value"><b>{averageLeakageCurrent}</b> mA</div>
              </div>
            </div>
            <div className="dashboard-container-content-bottom-container-analytics">
              <div className="dashboard-container-content-bottom-container-analytics-heading">AVERAGE LEAKAGE CURRENT ANALYTICS</div>
              <div className="dashboard-container-content-bottom-container-analytics-graph"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
