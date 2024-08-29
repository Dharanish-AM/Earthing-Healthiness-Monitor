import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Details() {
  const [poledetails, setPoleDetails] = useState({ current: [], time: [] });
  const [searchParams] = useSearchParams();
  const pole_id = searchParams.get("pole_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoleData = async () => {
      console.log("Fetching data for pole_id:", pole_id);
      try {
        const response = await axios.get(
          "http://localhost:8000/getcurrentlora",
          {
            params: { pole_id },
          }
        );
        console.log("Server response:", response.data);
        if (response.data.success) {
          const { current, time } = response.data.poledata;
          console.log("Fetched current:", current);
          console.log("Fetched time:", time);
          setPoleDetails({ current, time });
          console.log("Updated pole details:", { current, time });
        } else {
          console.error("Failed to fetch pole data");
        }
      } catch (error) {
        console.error("Error fetching pole data:", error);
      }
    };

    if (pole_id) {
      fetchPoleData();
    } else {
      navigate("/login");
    }
  }, [pole_id, navigate]);

  const chartData = {
    labels: poledetails.time,
    datasets: [
      {
        label: "Current Over Time",
        data: poledetails.current,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Current vs Time",
      },
    },
  };

  return (
    <div className="sensor-details-container">
      <h1>
        {poledetails.current} {poledetails.time}
      </h1>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default Details;
