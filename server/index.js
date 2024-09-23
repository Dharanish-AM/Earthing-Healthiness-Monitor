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
  getPolesDetails,
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
  getAllPoleDetails,
  getPoleDetails,
  getHistoryInfo,
  setHistoryInfo,
  getActiveTechnicians,
  updatePoleTechnician,
  findTechnicianById,
  findTechnician,
  setTaskCompleted,
  getTask,
} = require("./database/db");

const { verifyToken } = require("./middleware/Token");

app.use(express.json());

app.post("/login", async (req, res) => {
  const { emp_id, password } = req.body;
  ////console.log(emp_id, password);
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
    const empDetailsPromise = fetchEmployeeDetails(req.user.employee_id);

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
  const { lat, long, location } = req.body;
  try {
    const newPole = await addPole(lat, long, location);
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

    //console.log("New Technician:", newTechnician);

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
      //console.log("Email sent successfully");
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

    //console.log("New Employee:", newEmployee);

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
      //console.log("Email sent successfully");
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
    //console.log("Received data:", data);

    var current = Number(data.ct);
    if (isNaN(current)) {
      //console.log("Invalid current value:", data.ct);
      return res.status(400).json({ message: "Invalid current value" });
    }
    if (current <= 0) {
      current = 0;
    }
    await setCurrentInfo(data.id, current);

    if (current > 1) {
      //threshold
      desc = "Low";
      if (current >= 5) {
        desc = "High";
      }
      const poleDetails = await getPoleDetails(data.id);
      if (poleDetails) {
        const status = "Pending";
        const technician_id = "Not Assigned";
        const severity = desc;
        const description = "N/A";
        //const description = "High current detected";

        await setHistoryInfo(
          poleDetails.pole_id,
          status,
          technician_id,
          severity,
          description
        );
      }
    }

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

app.get("/getpolesdetailsmap", async (req, res) => {
  const response = await getPolesDetails();

  if (!response) {
    return res.status(404).send("Poles not found");
  }
  res.status(200).json({
    success: true,
    polesdata: response,
  });
});

app.get("/getAllPoleDetails", async (req, res) => {
  try {
    const poleDetails = await getAllPoleDetails();
    res.status(200).json({
      success: true,
      data: poleDetails,
    });
  } catch (error) {
    console.error("Error handling /getAllPoleDetails request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/getpoledeatils", async (req, res) => {
  const { poleid } = req.query;

  if (!poleid) {
    return res.status(400).json({ error: "Pole ID is required" });
  }

  try {
    const poleDetails = await getPoleDetails(poleid);
    res.status(200).json(poleDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/gethistoryinfo", async (req, res) => {
  try {
    const historyInfo = await getHistoryInfo();
    //console.log(historyInfo);
    res.status(200).json({
      success: true,
      data: historyInfo,
    });
  } catch (error) {
    console.error("Error fetching history info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch history info.",
    });
  }
});

app.get("/gettechniciandetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const technician = await findTechnicianById(id);
    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    console.error("Error fetching technician details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/assigntechnician", async (req, res) => {
  const { poleId, technicianId, status, description } = req.body;
  try {
    await updatePoleTechnician(poleId, technicianId, status, description);
    res.status(200).json({
      message: "Technician assigned and history updated successfully",
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});

app.get("/getactivetechnicians", async (req, res) => {
  try {
    const activeTechnicians = await getActiveTechnicians();
    res.status(200).json({ technicians: activeTechnicians });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//App
app.post("/technicianlogin", async (req, res) => {
  const { tid, tpassword } = req.body;

  try {
    const technician = await findTechnician(tid, tpassword);

    if (!technician) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful", technician });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

app.get("/gettask", async (req, res) => {
  const { technician_id } = req.query;
   (technician_id);
  try {
    const task = await getTask(technician_id);
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: "Error fetching task" });
  }
});

app.post("/settaskcompleted", async (req, res) => {
  const { pole_id, technician_id, datetime_completed, description } = req.body;

  try {
    const task = await setTaskCompleted(
      pole_id,
      technician_id,
      datetime_completed,
      description
    );

    if (task) {
      res.status(200).json({ message: "Task successfully completed" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error setting task completed:", error);
    res.status(500).json({ error: "Error setting task completed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
