import { useState } from "react";
import "../App.css";
import Header from "./Header";
import Account from "./Account";

function Technician() {
    const [technicians, setTechnicians] = useState([
        { id: '1', name: 'Ram', email: 'ram@example.com', password: 'password123', age: '30', address: '123 Main Street', dob: '1993-02-14', place: 'Pollachi', mobile: '1234567890', furtherDetails: 'Experienced technician' },
        { id: '2', name: 'Vijay', email: 'vijay@example.com', password: 'password123', age: '28', address: '456 Maple Avenue', dob: '1995-08-22', place: 'Pollachi', mobile: '0987654321', furtherDetails: 'Specializes in HVAC systems' },
        { id: '3', name: 'Sanjay', email: 'sanjay@example.com', password: 'password123', age: '32', address: '789 Oak Road', dob: '1991-11-30', place: 'Pollachi', mobile: '1122334455', furtherDetails: 'Expert in electrical systems' },
        { id: '4', name: 'Rohith', email: 'rohith@example.com', password: 'password123', age: '27', address: '321 Pine Lane', dob: '1996-05-14', place: 'Pollachi', mobile: '5566778899', furtherDetails: 'Specializes in renewable energy systems' }
    ]);


    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        age: "",
        address: "",
        dob: "",
        place: "",
        mobile: "",
        furtherDetails: "",
    });

    const [showForm, setShowForm] = useState(false);


    const [isEditing, setIsEditing] = useState(false);

    const [currentTechnician, setCurrentTechnician] = useState(null);

    const [profile, setProfile] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProfileClick = () => {
        setProfile(true);
    };

    const handleCloseProfile = () => {
        setProfile(false);
    };

    const handleAddTechnician = () => {
        if (isEditing) {

            setTechnicians(technicians.map((tech) =>
                tech.id === currentTechnician.id ? formData : tech
            ));
            setIsEditing(false);
            setCurrentTechnician(null);
        } else {

            setTechnicians([...technicians, { ...formData, id: Date.now().toString() }]);
        }
        resetForm();
    };

    const handleEditTechnician = (id) => {
        const technician = technicians.find((tech) => tech.id === id);
        setFormData(technician);
        setCurrentTechnician(technician);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDeleteTechnician = (id) => {
        setTechnicians(technicians.filter((tech) => tech.id !== id));
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            email: "",
            password: "",
            age: "",
            address: "",
            dob: "",
            place: "",
            mobile: "",
            furtherDetails: "",
        });
        setShowForm(false);
        setIsEditing(false);
    };

    return (
        <div className="manage-technicians-container">
            <Header onProfileClick={handleProfileClick} />
            {profile && (
                <>
                    <div className="profile-backdrop" onClick={handleCloseProfile}></div>
                    <Account onCloseProfile={handleCloseProfile} />
                </>
            )}
            <div className="dashboard-main">
                <div className="dashboard-toolbar">
                    <h1 className="dashboard-main-title">Technician Management</h1>
                    <button className="manage-technician-btn" onClick={() => setShowForm(true)}>
                        Add Technician
                    </button>
                </div>
                {showForm && (
                    <>
                        <div className="form-backdrop" onClick={resetForm}></div>
                        <div className="form-popup">
                            <div className="form-header">
                                <h2>{isEditing ? "Edit Technician" : "Add Technician"}</h2>
                                <button className="close-btn" onClick={resetForm}>X</button>
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            <input
                                type="date"
                                name="dob"
                                placeholder="Date of Birth"
                                value={formData.dob}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="place"
                                placeholder="Place"
                                value={formData.place}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="furtherDetails"
                                placeholder="Further Details"
                                value={formData.furtherDetails}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddTechnician}>
                                {isEditing ? "Update Technician" : "Add Technician"}
                            </button>
                            <button className="cancel-btn" onClick={resetForm}>Cancel</button>
                        </div>
                    </>
                )}
                <div className="technician-list">
                    <ul>
                        {technicians.map((technician) => (
                            <li key={technician.id}>
                                <div className="technician-details">
                                    <div className="technician-item"><span style={{ fontWeight: "550" }}>ID: </span>{technician.id}ㅤ
                                        <span style={{ fontWeight: "550" }}>Name: </span>{technician.name}ㅤ
                                        <span style={{ fontWeight: "550" }}>Location: </span>{technician.place}</div>
                                </div>
                                <div className="technician-actions">
                                    <button onClick={() => handleEditTechnician(technician.id)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteTechnician(technician.id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Technician;
