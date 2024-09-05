import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import correct from "../assets/correct.svg";
import warning from "../assets/warning.svg";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [empDetails, setEmpDetails] = useState({});
  const [polesStatus, setPoleStatus] = useState([]);
  const [activeTechnicians, setActiveTechnicians] = useState([]);
  const [averageLeakageCurrent, setAverageLeakageCurrent] = useState(0);
  const [hourlyTimeDateCurrent, setHourlyTimeDateCurrent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8000/dashboard", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setEmpDetails(response.data.empDetails);
          setPoleStatus(response.data.polesStatus);
          setActiveTechnicians(response.data.activeTechnicians);
          avgLeakageCurrent(response.data.polesStatus);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const errorPoles = polesStatus.filter(
    (poleStatus) =>
      poleStatus.status === "Error" && poleStatus.status !== "In Progress"
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
    let timeData = [];

    polesStatus.forEach((pole) => {
      const { day_average } = pole;

      if (day_average.length > 0) {
        totalLeakageCurrent += day_average[day_average.length - 1].current;
        count++;

        day_average.forEach((entry) => {
          if (entry.time) {
            const formattedTime = new Date(entry.time).toLocaleString();
            const timedatesplit = formattedTime.split(",");
            timeData.push({
              time: timedatesplit[1].trim(),
              date: timedatesplit[0].trim(),
              current: entry.current,
            });
          }
        });
      }
    });

    const average =
      count > 0 ? (totalLeakageCurrent / count).toFixed(2) : "0.00";
    setAverageLeakageCurrent(average);
    setHourlyTimeDateCurrent(timeData);
  }

  const HighAverageCurrent = averageLeakageCurrent > 1;

  const chartData = {
    labels: hourlyTimeDateCurrent.map((data) => data.time),
    datasets: [
      {
        label: "Average Leakage Current (mA)",
        data: hourlyTimeDateCurrent.map((data) => data.current),
        fill: false,
        borderColor: HighAverageCurrent ? "#D71313" : "#4BAE4F",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "black",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Leakage Current (mA)",
          color: "black",
        },
      },
    },
  };

  const downloadReport = () => {
    const ws = XLSX.utils.json_to_sheet(
      hourlyTimeDateCurrent.map(({ time, current }) => ({
        Time: time,
        Current: current,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Average Leakage Current");
    XLSX.writeFile(wb, "Average_Leakage_Current_Report.xlsx");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
              <div
                className="dashboard-container-content-top-overview-error-image"
                style={{
                  backgroundImage: `url(${
                    errorPoles.length === 0 ? correct : warning
                  })`,
                }}
              ></div>
              <div className="dashboard-container-content-top-overview-error-text">
                NO OF ERRORS : {"\u00A0"}
                <b>{errorPoles.length}</b>
              </div>
            </div>
            <div className="dashboard-container-content-top-overview-technician">
              <div className="dashboard-container-content-top-overview-technician-heading">
                ACTIVE TECHNICIAN
              </div>
              <div className="dashboard-container-content-top-overview-technician-count">
                <div>{activeTechnicians.length}</div>
              </div>
              <div className="dashboard-container-content-top-overview-technician-text">
                NO OF TECHNICIANS
              </div>
            </div>
            <div className="dashboard-container-content-top-overview-options">
              <div className="dashboard-container-content-top-overview-technician-heading">
                OPTIONS
              </div>
              <div className="dashboard-container-content-top-overview-options-division">
                <div className="dashboard-container-content-top-overview-options-division-b1">
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/dashboard/technicians");
                    }}
                  >
                    MANAGE TECHNICIAN
                  </button>
                </div>
                <div className="dashboard-container-content-top-overview-options-division-b2">
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/dashboard/poles");
                    }}
                  >
                    MANAGE POLES
                  </button>
                </div>
                <div className="dashboard-container-content-top-overview-options-division-b3">
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={downloadReport}
                  >
                    VIEW REPORT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-container-content-top-profile">
            <div className="dashboard-container-content-top-profile-name">
              {empDetails.name}
            </div>
            <div className="dashboard-container-content-top-profile-details">
              <div className="dashboard-container-content-top-profile-details-id">
                <b>ID</b> : {empDetails.employee_id}
              </div>
              <div className="dashboard-container-content-top-profile-details-email">
                <b>EMAIL</b> : {empDetails.email}
              </div>
              <div className="dashboard-container-content-top-profile-details-contact">
                <b>CONTACT</b> : {empDetails.phone}
              </div>
            </div>
            <div
              className="dashboard-container-content-top-profile-logout"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGOUT
            </div>
          </div>
        </div>
        <div className="dashboard-container-content-bottom">
          <div className="dashboard-container-content-bottom-container">
            <div className="dashboard-container-content-bottom-container-stats">
              <div className="dashboard-container-content-bottom-container-stats-poles">
                <div className="dashboard-container-content-bottom-container-stats-poles-div1">
                  <div className="dashboard-container-content-bottom-container-stats-poles-total">
                    <span>TOTAL POLES</span>
                    <span>
                      <b>{polesStatus.length}</b>
                    </span>
                  </div>
                  <div className="dashboard-container-content-bottom-container-stats-poles-active">
                    <span>ACTIVE POLES</span>
                    <span>
                      <b>{activePoles.length}</b>
                    </span>
                  </div>
                </div>
                <div className="dashboard-container-content-bottom-container-stats-poles-div2">
                  <div className="dashboard-container-content-bottom-container-stats-poles-inactive">
                    <span>INACTIVE POLES</span>
                    <span>
                      <b>{inactivePoles.length}</b>
                    </span>
                  </div>
                  <div className="dashboard-container-content-bottom-container-stats-poles-maintenance">
                    <span>UNDER MAINTENANCE</span>
                    <span>
                      <b>{maintenancePoles.length}</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="dashboard-container-content-bottom-container-stats-current">
                <div className="dashboard-container-content-bottom-container-stats-current-heading">
                  AVERAGE LEAKAGE CURRENT
                </div>
                <div className="dashboard-container-content-bottom-container-stats-current-value">
                  <b
                    style={
                      averageLeakageCurrent > 25 ? { color: "#D71313" } : null
                    }
                  >
                    {averageLeakageCurrent}
                  </b>
                  <span
                    style={
                      averageLeakageCurrent > 25 ? { color: "#D71313" } : null
                    }
                  >
                    mA
                  </span>
                </div>
              </div>
            </div>
            <div className="dashboard-container-content-bottom-container-analytics">
              <div className="dashboard-container-content-bottom-container-analytics-heading">
                <div>AVERAGE LEAKAGE CURRENT ANALYTICS</div>
                <div>
                  <button onClick={openModal}>View Detail</button>
                </div>
              </div>
              <div className="dashboard-container-content-bottom-container-analytics-graph">
                <Line
                  className="Chart"
                  data={chartData}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Average Leakage Current Analytics</h2>
              <button onClick={closeModal} className="modal-close">
                X
              </button>
            </div>
            <div className="modal-body">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
