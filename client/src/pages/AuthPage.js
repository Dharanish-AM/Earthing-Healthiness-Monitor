import "../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [empid, setEmpID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/login", {
        emp_id: empid,
        password: password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate(`/dashboard`);
      } else {
        console.log("Login failed:", response.data);
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  }

  return (
    <section className="authpage-container">
      <div className="authpage-container-left">
        <div className="authpage-container-left-heading">
          EARTHING HEALTHINESS MONITORING
        </div>
        <div className="authpage-container-left-title">
          LOGIN PORTAL
        </div>
        <div className="authpage-container-left-userid">
          <div className="authpage-container-left-userid-title">
            EMPLOYEE ID
          </div>
          <div className="authpage-container-left-userid-field">
            <input
              type="text"
              required
              placeholder="employee id"
              value={empid}
              onChange={(e) => setEmpID(e.target.value)}
            />
          </div>
        </div>
        <div className="authpage-container-left-password">
          <div className="authpage-container-left-password-title">
            PASSWORD
          </div>
          <div className="authpage-container-left-password-field">
            <input
              type="password"
              required
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="authpage-container-left-submit">
          <button onClick={handleSubmit} type="submit" style={{cursor:"pointer"}}>LOGIN</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className="authpage-container-right">

      </div>
    </section>
  );
}

export default AuthPage;
