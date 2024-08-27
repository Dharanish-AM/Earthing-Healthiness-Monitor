import "../App.css"
import axios from "axios"
import {useState , useEffect} from "react"

function AuthPage() {

    const [empid, setEmpID] = useState("")
    const [password, setPassword] = useState("");

    function handleSubmit(params) {

    }
    return (
        <div className="authpage-container">
            <h1>Auth Page</h1>
            <label>Employee ID:</label>
            <input type="text" id="employeeid" name="employeeid" onChange={empid} />
            <label>Password:</label>
            <input type="password" id="password" name="password" onC />
            <button type="submit">Login</button>
        </div>
    )
}

export default AuthPage