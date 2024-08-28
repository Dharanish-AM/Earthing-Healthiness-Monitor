const express = require("express");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

const {
  Login,
  addEmployee,
  addPole,
  addTechnician,
  fetchPoleID,
  fetchPoleCords,
  getPoleDetails,
  assignTechnician,
  fetchHistory,
  getAllTechnicians,
} = require("./database/db");

app.use(express.json());

app.post("/login", async (req, res) => {
  const { emp_id, password } = req.body;
  try {
    const token = await Login(emp_id, password);
    if (token) {
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/addtechnician", async (req, res) => {
  const { name, age, email, phone, address } = req.body;
  try {
    const newTechnician = await addTechnician(name, age, email, phone, address);
    res.status(201).json({ success: true, technician: newTechnician });
  } catch (err) {
    console.log("Error during adding technician:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/loradata", (req, res) => {
  try {
    const data = req.body.data;
    console.log("recieved data", data);
    if (data) {
      res.status(200).json({ message: "Data Recieved Sucessfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error Processing Data" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
