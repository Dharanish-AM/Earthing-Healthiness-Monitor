import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Admin = () => {
    const [employees, setEmployees] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [newTechnician, setNewTechnician] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedTechnician, setSelectedTechnician] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchTechnicians();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:8000/employees");
            setEmployees(response.data.employees);
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const response = await axios.get("http://localhost:8000/technicians");
            setTechnicians(response.data.technicians);
        } catch (err) {
            console.error("Error fetching technicians:", err);
        }
    };

    const handleAddEmployee = async () => {
        try {
            const response = await axios.post("http://localhost:8000/addemployee", newEmployee);
            console.log("Employee added:", response.data.employee);
            fetchEmployees();
        } catch (err) {
            console.error("Error adding employee:", err);
        }
    };

    const handleAddTechnician = async () => {
        try {
            const response = await axios.post("http://localhost:8000/addtechnician", newTechnician);
            console.log("Technician added:", response.data.technician);
            fetchTechnicians();
        } catch (err) {
            console.error("Error adding technician:", err);
        }
    };

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleViewTechnician = (technician) => {
        setSelectedTechnician(technician);
    };

    const handleCloseDetail = () => {
        setSelectedEmployee(null);
        setSelectedTechnician(null);
    };

    return (
        <div className="admin-body">
            <h1 className="admin-header">Admin Page</h1>

            <div className="admin-forms-container">
                <section className="admin-section">
                    <h2 className="admin-section-title">Add Employee</h2>
                    <div className="admin-form">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Name</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Name"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Age</label>
                            <input
                                className="admin-form-input"
                                type="number"
                                placeholder="Age"
                                value={newEmployee.age}
                                onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Email</label>
                            <input
                                className="admin-form-input"
                                type="email"
                                placeholder="Email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Phone</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Phone"
                                value={newEmployee.phone}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Address</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Address"
                                value={newEmployee.address}
                                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Password</label>
                            <input
                                className="admin-form-input"
                                type="password"
                                placeholder="Password"
                                value={newEmployee.password}
                                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                            />
                        </div>
                        <button className="admin-form-button" onClick={handleAddEmployee}>Add Employee</button>
                    </div>
                </section>

                <section className="admin-section">
                    <h2 className="admin-section-title">Add Technician</h2>
                    <div className="admin-form">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Name</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Name"
                                value={newTechnician.name}
                                onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Age</label>
                            <input
                                className="admin-form-input"
                                type="number"
                                placeholder="Age"
                                value={newTechnician.age}
                                onChange={(e) => setNewTechnician({ ...newTechnician, age: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Email</label>
                            <input
                                className="admin-form-input"
                                type="email"
                                placeholder="Email"
                                value={newTechnician.email}
                                onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Phone</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Phone"
                                value={newTechnician.phone}
                                onChange={(e) => setNewTechnician({ ...newTechnician, phone: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Address</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                placeholder="Address"
                                value={newTechnician.address}
                                onChange={(e) => setNewTechnician({ ...newTechnician, address: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Password</label>
                            <input
                                className="admin-form-input"
                                type="password"
                                placeholder="Password"
                                value={newTechnician.password}
                                onChange={(e) => setNewTechnician({ ...newTechnician, password: e.target.value })}
                            />
                        </div>
                        <button className="admin-form-button" onClick={handleAddTechnician}>Add Technician</button>
                    </div>
                </section>
            </div>

            <section style={{ display: "flex", justifyContent: "space-between" }}>
                <section className="admin-section">
                    <h2 className="admin-section-title">View Employees</h2>
                    <ul className="admin-table">
                        {employees.map((employee) => (
                            <li
                                key={employee.employee_id}
                                className="admin-table-row"
                                onClick={() => handleViewEmployee(employee)}
                            >
                                {employee.employee_id} - {employee.name} - {employee.address}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="admin-section">
                    <h2 className="admin-section-title">View Technicians</h2>
                    <ul className="admin-table">
                        {technicians.map((technician) => (
                            <li
                                key={technician.technician_id}
                                className="admin-table-row"
                                onClick={() => handleViewTechnician(technician)}
                            >
                                {technician.technician_id} - {technician.name} - {technician.address}
                            </li>
                        ))}
                    </ul>
                </section>
            </section>

            {(selectedEmployee || selectedTechnician) && (
                <div className="admin-detail-view">
                    <div className="admin-detail-content">
                        <button className="admin-detail-close" onClick={handleCloseDetail}>Close</button>
                        {selectedEmployee && (
                            <>
                                <h2>Employee Details</h2>
                                <p><strong>ID:</strong> {selectedEmployee.employee_id}</p>
                                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                                <p><strong>Age:</strong> {selectedEmployee.age}</p>
                                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                                <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                                <p><strong>Address:</strong> {selectedEmployee.address}</p>
                            </>
                        )}
                        {selectedTechnician && (
                            <>
                                <h2>Technician Details</h2>
                                <p><strong>ID:</strong> {selectedTechnician.technician_id}</p>
                                <p><strong>Name:</strong> {selectedTechnician.name}</p>
                                <p><strong>Age:</strong> {selectedTechnician.age}</p>
                                <p><strong>Email:</strong> {selectedTechnician.email}</p>
                                <p><strong>Phone:</strong> {selectedTechnician.phone}</p>
                                <p><strong>Address:</strong> {selectedTechnician.address}</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
