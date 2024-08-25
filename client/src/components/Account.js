import { useState } from "react";
import "../App.css";

function Account({ onClose }) {

    const [user, setuser] = useState({
        name: "User",
        email: "user@gmail.com",
        role: "123456789"
    })

    return (
        <div className="profile-container">
            <button className="profile-close-btn" onClick={onClose}>X</button>
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
            <div className="profile-actions">
                <button className="profile-action-btn">Logout</button>
                <button className="profile-action-btn">Delete</button>
            </div>
        </div>
    );
}

export default Account;
