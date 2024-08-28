import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Account from "../components/Account";
import axios from 'axios';

function Dashboard() {
    const [empDetails, setEmpDetails] = useState(null);
    const [poleStatus, setPoleStatus] = useState([]);
    const [activeTechnicians, setActiveTechnicians] = useState([]);
    const [profile, setProfile] = useState(false);
    const navigate = useNavigate();

    function handleProfileClick() {
        setProfile(true);
    }

    function handleCloseProfile() {
        setProfile(false);
    }




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

                            </div>
                            <div className="dashboard-container-content-left-top-left-bottom">

                            </div>
                        </div>
                        <div className="dashboard-container-content-left-top-right">

                        </div>
                    </div>
                    <div className="dashboard-container-content-left-bottom">
                        <div className="dashboard-container-content-left-bottom-left">
                            <div className="dashboard-container-content-left-bottom-left-activeError">
                                ACTIVE ERRORS
                            </div>
                            <div className="dashboard-container-content-left-bottom-left-image">

                            </div>
                            <div className="dashboard-container-content-left-bottom-left-text">
                                <span>NO OF ERRORS : </span>
                            </div>
                        </div>
                        <div className="dashboard-container-content-left-bottom-right">
                            <div className="dashboard-container-content-left-bottom-right-technicians">
                                TECHNICIANS
                            </div>
                            <div className="dashboard-container-content-left-bottom-right-count">

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

                        </div>
                        <div className="dashboard-container-content-right-profile-details">
                            <div>
                                <span>EMP_ID : </span>
                                <span></span>
                            </div>
                            <div>
                                <span>EMAIL : </span>
                                <span></span>
                            </div>
                            <div>
                                <span>CONTACT : </span>
                                <span></span>
                            </div>
                        </div>
                        <div className="dashboard-container-content-right-profile-logout">
                            LOGOUT
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
