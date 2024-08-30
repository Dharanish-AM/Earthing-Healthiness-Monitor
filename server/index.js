const express = require("express");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const {
  Login,
  addEmployee,
  addTechnician,
  addPole,
  fetchPoleID,
  fetchPoleCords,
  getPoleDetails,
  assignTechnician,
  fetchHistory,
  getAllTechnicians,
  fetchEmployeeDetails,
  fetchPolesStatus,
  fetchActiveTechnicians,
  getNextSequenceValue,
  fetchAllEmployeesDetails,
  setCurrentInfo,
  getCurrentInfo,
} = require("./database/db");

const { verifyToken } = require("./middleware/Token");

app.use(express.json());

app.post("/login", async (req, res) => {
  const { emp_id, password } = req.body;
  console.log(emp_id, password);
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

app.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const polesStatusPromise = fetchPolesStatus();
    const activeTechniciansPromise = fetchActiveTechnicians();
    const empDetailsPromise = fetchEmployeeDetails(req.user.emp_id);

    const [polesStatus, activeTechnicians, empDetails] = await Promise.all([
      polesStatusPromise,
      activeTechniciansPromise,
      empDetailsPromise,
    ]);

    if (!empDetails) {
      return res.status(404).json({ error: "Employee details not found." });
    }

    res.json({ empDetails, polesStatus, activeTechnicians });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addpole", async (req, res) => {
  const { lat, long } = req.body;
  try {
    const newPole = await addPole(lat, long);
    res.status(201).json({ message: "Pole added successfully", pole: newPole });
  } catch (err) {
    console.error("Error adding pole:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/addtechnician", async (req, res) => {
  const { name, age, email, phone, address, password } = req.body;
  try {
    const newTechnician = await addTechnician(
      name,
      age,
      email,
      phone,
      address,
      password
    );

    console.log("New Technician:", newTechnician);

    const msg = {
      to: email,
      from: "dharanish816@gmail.com",
      subject: "Log In Now",
      templateId: "d-25f0d4acebd84e62b66e7210e181e02b",
      dynamicTemplateData: {
        role: "Technician",
        id: newTechnician.technician_id,
      },
    };
    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError.response.body.errors);
    }

    res.status(201).json({ success: true, technician: newTechnician });
  } catch (err) {
    console.error("Error during adding technician:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/addemployee", async (req, res) => {
  const { name, age, email, phone, address, password } = req.body;
  try {
    const newEmployee = await addEmployee(
      name,
      age,
      email,
      phone,
      address,
      password
    );

    console.log("New Employee:", newEmployee);

    const msg = {
      to: email,
      from: "dharanish816@gmail.com",
      subject: "Log In Now",
      templateId: "d-25f0d4acebd84e62b66e7210e181e02b",
      dynamicTemplateData: {
        role: "Employee",
        id: newEmployee.employee_id,
      },
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
      res.status(201).json({ success: true, employee: newEmployee });
    } catch (emailError) {
      console.error("Error sending email:", emailError.response.body.errors);
      res.status(500).json({ success: false, message: "Error sending email" });
    }
  } catch (err) {
    console.error("Error during adding employee:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await fetchAllEmployeesDetails();
    res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/technicians", async (req, res) => {
  try {
    const technicians = await getAllTechnicians();
    res.status(200).json({ success: true, technicians });
  } catch (err) {
    console.error("Error fetching technicians:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/loradata", async (req, res) => {
  try {
    const data = req.body.data;
    console.log("Received data:", data);
    const current = Number(data.ct);
    if (isNaN(current)) {
      console.log("Invalid current value:", data.ct);
      return res.status(400).json({ message: "Invalid current value" });
    }

    await setCurrentInfo(data.id, current);

    res.status(200).json({ message: "Data Received Successfully" });
  } catch (err) {
    console.error("Error processing data:", err);
    res.status(500).json({ message: "Error Processing Data" });
  }
});

app.get("/getcurrentlora", async (req, res) => {
  try {
    const { pole_id } = req.query;
    if (!pole_id) {
      return res
        .status(400)
        .json({ success: false, message: "pole_id is required" });
    }

    const poledata = await getCurrentInfo(pole_id);
    res.status(200).json({
      success: true,
      poledata: {
        current: poledata.current,
        time: poledata.time,
      },
    });
  } catch (err) {
    console.error("Error fetching current info:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
