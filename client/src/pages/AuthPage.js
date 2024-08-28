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
    <section className="authpage-container">
      <div className="">

      </div>
      <div>

      </div>
    </section>
  );
}

export default AuthPage;
