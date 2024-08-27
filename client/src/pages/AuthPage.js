import "../App.css";
import axios from "axios";
import { useState } from "react";

function AuthPage() {
  const [empid, setEmpID] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      console.log("Employee ID:", empid);
      console.log("Password:", password);

      const response = await axios.post("http://localhost:8000/login", {
        emp_id: empid,
        password: password,
      });
      console.log("Login successful:", response.data);
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="authpage-container">
      <h1>Auth Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="employeeid">Employee ID:</label>
        <input
          type="text"
          id="employeeid"
          name="employeeid"
          onChange={(e) => setEmpID(e.target.value)}
          value={empid}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button onClick={handleSubmit} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
