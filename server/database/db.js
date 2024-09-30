const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const counterSchema = new mongoose.Schema(
  {
    _id: String,
    sequence_value: { type: Number, default: 0 },
  },
  { _id: false }
);

const Counter = mongoose.model("Counter", counterSchema);

async function getNextSequenceValue(sequenceName, prefix) {
  try {
    const sequence = await Counter.findByIdAndUpdate(
      sequenceName,
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return prefix + sequence.sequence_value.toString().padStart(6, "0");
  } catch (error) {
    console.error("Error getting next sequence value:", error);
    throw error;
  }
}

const poleSchema = new mongoose.Schema({
  pole_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length === 2;
      },
      message:
        "Coordinates must be an array of two strings [latitude, longitude].",
    },
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Under Maintenance", "Error"],
    default: "Active",
  },
  maintenance_details: { type: [String], default: "n/a" },
  total: { type: Number, default: 0, min: 0 },
  count: { type: Number, default: 0, min: 0 },
  day_average: [
    {
      time: {
        type: Date,
        required: true,
      },
      current: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 18, max: 65 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: String,
  password: { type: String, required: true },
});

const technicianSchema = new mongoose.Schema({
  technician_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 18, max: 65 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: String,
  history: { type: [String], default: [] },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const historySchema = new mongoose.Schema({
  pole_id: { type: String, required: true, index: true },
  date_time: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ["Fixed", "Pending", "In Progress"],
  },
  technician_id: { type: String, required: true, index: true },
  severity: { type: String, enum: ["Low", "Medium", "High"] },
  lastrepaired_on: { type: Date, default: null },
  description: { type: String, trim: true },
});

const TasksSchema = new mongoose.Schema({
  pole_id: { type: String, required: true },
  technician_id: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Fixed", "Pending", "In Progress"],
  },
  taskstart_date: { type: Date, default: null },
  taskend_date: { type: Date, default: null },
  severity: { type: String, default: null },
  location: { type: String, default: null },
  coordinates: { type: [String], default: null },
  description: { type: String },
});

const Pole = mongoose.model("Pole", poleSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Technician = mongoose.model("Technician", technicianSchema);
const History = mongoose.model("History", historySchema);
const Tasks = mongoose.model("Tasks", TasksSchema);

async function Login(employee_id, password) {
  try {
    const employee = await Employee.findOne({ employee_id });
    if (!employee) {
      //console.log("Invalid User");
      return null;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (isMatch) {
      //console.log("User Valid");
      const token = jwt.sign(
        { employee_id: employee.employee_id },
        process.env.JWT_KEY
      );
      //console.log("JWT Token:", token);
      return token;
    } else {
      //console.log("Invalid User");
      return null;
    }
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

async function addEmployee(name, age, email, phone, address, password) {
  try {
    const employee_id = await getNextSequenceValue("employee_id", "E");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newEmployee = new Employee({
      employee_id,
      name,
      age,
      email,
      phone,
      address,
      password: hashedPassword,
    });
    return await newEmployee.save();
  } catch (err) {
    throw err;
  }
}

async function addTechnician(name, age, email, phone, address, password) {
  try {
    const technician_id = await getNextSequenceValue("technician_id", "T");

    if (!password || typeof password !== "string") {
      throw new Error("Invalid password provided");
    }

    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      throw new Error("Failed to generate salt");
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }

    const technician = new Technician({
      technician_id,
      name,
      age,
      email,
      phone,
      address,
      password: hashedPassword,
    });
    const savedTechnician = await technician.save();
    //console.log("Technician added:", savedTechnician);
    return savedTechnician;
  } catch (err) {
    console.error("Error while adding technician:", err);
    throw err;
  }
}

async function addPole(lat, long, location) {
  try {
    const pole_id = await getNextSequenceValue("pole_id", "P");
    const pole = new Pole({
      pole_id,
      coordinates: [lat, long],
      location,
    });
    const result = await pole.save();
    //console.log("Pole added:", result);
    return result;
  } catch (error) {
    console.error("Error while adding pole:", error);
    throw error;
  }
}

async function fetchPoleID() {
  try {
    const Poles = await Pole.find();
    const PoleIDs = Poles.map((Pole) => Pole.pole_id);
    //console.log("Pole IDs:", PoleIDs);
    return PoleIDs;
  } catch (error) {
    console.error("Error fetching pole IDs:", error);
  }
}

async function fetchPoleCords() {
  try {
    const Poles = await Pole.find();
    const PoleCords = Poles.map((Pole) => Pole.coordinates);
    //console.log("Pole Coordinates:", PoleCords);
    return PoleCords;
  } catch (err) {
    console.error("Error fetching pole cords:", err);
  }
}

async function getPolesDetails() {
  try {
    const poles = await Pole.find({}, "pole_id coordinates status location");
    if (!poles.length) {
      //console.log("Poles not found");
      return null;
    }

    //console.log("Poles Details:", poles);
    return poles;
  } catch (err) {
    console.error("Error fetching poles details:", err);
  }
}

async function assignTechnician(pole_id, technician_id) {
  try {
    const pole = await Pole.findOne({ pole_id });

    if (!pole) {
      //console.log("Pole not found");
      return null;
    }

    pole.technician_id = technician_id;

    const updatedPole = await pole.save();

    //console.log("Technician assigned:", updatedPole);
    return updatedPole;
  } catch (err) {
    console.error("Error assigning technician:", err);
  }
}

async function fetchHistory() {
  try {
    const history = await History.find().sort({ date_time: -1 });
    //console.log("History:", history);
    return history;
  } catch (error) {
    console.error("Error while fetching history:", error);
  }
}

async function getAllTechnicians() {
  try {
    const technicians = await Technician.find();
    //console.log("Technicians:", technicians);
    return technicians;
  } catch (err) {
    console.error("Error fetching technicians:", err);
  }
}

async function fetchEmployeeDetails(emp_id) {
  try {
    const employee = await Employee.findOne({ employee_id: emp_id });
    if (!employee) {
      //console.log("Employee not found");
      return null;
    }
    //console.log("Employee Details:", employee);
    return employee;
  } catch (err) {
    console.error("Error fetching employee details:", err);
    throw err;
  }
}

async function fetchAllEmployeesDetails() {
  try {
    const employees = await Employee.find();
    if (employees.length === 0) {
      //console.log("No employees found");
      return [];
    }
    //console.log("Employee Details:", employees);
    return employees;
  } catch (err) {
    console.error("Error fetching employee details:", err);
    throw err;
  }
}

async function fetchPolesStatus() {
  try {
    const poles = await Pole.find({}, "pole_id status day_average");

    if (!poles || poles.length === 0) {
      //console.log("No poles found");
      return [];
    }
    //console.log("Pole Statuses:", poles);
    return poles;
  } catch (err) {
    console.error("Error fetching pole statuses:", err);
    throw err;
  }
}

async function fetchActiveTechnicians() {
  try {
    const activeTechnicians = await Technician.find({ active: true });
    return activeTechnicians;
  } catch (error) {
    console.error("Error fetching active technicians:", error);
    throw error;
  }
}

async function fetchAllEmployees() {
  try {
    const employees = await Employee.find();
    //console.log("All Employees:", employees);
    return employees;
  } catch (err) {
    console.error("Error fetching all employees:", err);
    throw err;
  }
}

async function setCurrentInfo(pole_id, current) {
  try {
    const pole = await Pole.findOne({ pole_id });

    if (!pole) {
      //console.log(`Pole with ID ${pole_id} not found.`);
      return;
    }

    if (typeof current !== "number" || current < 0) {
      //console.log(`Invalid current value: ${current}. Must be a non-negative number.`);
      return;
    }

    const dateTime = new Date();
    pole.total += current;
    pole.count++;

    if (current > 1) {
      //threshold
      pole.status = "Error";
    }

    if (pole.count >= 4) {
      const avg = pole.total / pole.count;

      if (!pole.day_average) {
        pole.day_average = [];
      }

      pole.day_average.push({ time: dateTime, current: avg });
      pole.total = 0;
      pole.count = 0;
    }

    await pole.save();
    //console.log(`Pole ID ${pole_id} updated successfully.`);
  } catch (err) {
    console.error("Error while setting current information:", err);
  }
}

async function getCurrentInfo(pole_id) {
  try {
    //console.log("Searching for pole with ID:", pole_id);
    const poledetails = await Pole.findOne({ pole_id: "P000001" });
    if (!poledetails) {
      console.error(`Pole not found for ID: ${pole_id}`);
      throw new Error("Pole not found");
    }
    //console.log(poledetails);
    //console.log(poledetails.status);
    const { time, current } = poledetails.daily_average[0];
    //console.log(`Current info for pole ${pole_id}:`, { time, current });
    return { time, current };
  } catch (err) {
    console.error("Error in getCurrentInfo:", err);
    throw err;
  }
}

async function getAllPoleDetails() {
  try {
    const poleDetails = await Pole.find();
    //console.log("Poles Details:", poleDetails);
    return poleDetails;
  } catch (err) {
    console.error("Error in getAllPoleDetails:", err);
    throw err;
  }
}

async function getPoleDetails(poleid) {
  try {
    const poleDetails = await Pole.findOne({ pole_id: poleid });
    if (!poleDetails) {
      throw new Error("Pole not found");
    }
    return poleDetails;
  } catch (err) {
    console.error("Error in getPoleDetails:", err);
    throw err;
  }
}

const getHistoryInfo = async () => {
  try {
    const historyInfo = await History.find().sort({ date_time: -1 }).exec();
    return historyInfo;
  } catch (err) {
    if (err.code === "ECONNRESET") {
      //console.log("Connection reset, retrying...");
      await new Promise((res) => setTimeout(res, 2000));
      return await getHistoryInfo();
    }
    throw new Error(`Failed to fetch history info: ${err.message}`);
  }
};

async function setHistoryInfo(
  pole_id,
  status,
  technician_id,
  severity,
  description
) {
  try {
    const historyEntry = new History({
      pole_id,
      status,
      technician_id,
      severity,
      description,
    });
    await historyEntry.save();
    //console.log("History entry saved:", historyEntry);
  } catch (err) {
    console.error("Error saving history entry:", err);
    throw err;
  }
}

async function getActiveTechnicians() {
  try {
    const activeTechnicians = await Technician.find({ active: true });
    return activeTechnicians;
  } catch (err) {
    console.error("Error fetching active technicians:", err);
    throw new Error("Failed to fetch active technicians");
  }
}

const updatePoleTechnician = async (
  poleId,
  technicianId,
  status = "In Progress",
  description = null
) => {
  try {
    const poledetails = await Pole.findOne({ pole_id: poleId });
    if (!poledetails) {
      throw new Error(`Pole with ID ${poleId} not found.`);
    }

    const updatedHistory = await History.findOneAndUpdate(
      { pole_id: poleId },
      {
        technician_id: technicianId,
        status,
        description,
      },
      { new: true }
    );

    if (!updatedHistory) {
      throw new Error("Failed to update history. Record not found.");
    }

    await Pole.updateOne({ pole_id: poleId }, { status });

    const taskUpdateResult = await Tasks.updateOne(
      { pole_id: poleId, technician_id: technicianId },
      {
        pole_id: updatedHistory.pole_id,
        technician_id: updatedHistory.technician_id,
        status: updatedHistory.status,
        taskstart_date: updatedHistory.date_time,
        taskend_date: null,
        severity: updatedHistory.severity,
        location: poledetails.location,
        coordinates: poledetails.coordinates,
      },
      { upsert: true }
    );

    if (
      taskUpdateResult.nModified === 0 &&
      taskUpdateResult.upserted === undefined
    ) {
      throw new Error("Failed to update or insert the task.");
    }

    //console.log("Task successfully updated");
  } catch (err) {
    console.error(`Error in updatePoleTechnician: ${err.message}`);
    throw new Error(`Failed to update history, pole, and task: ${err.message}`);
  }
};

const findTechnicianById = async (id) => {
  try {
    const technician = await Technician.findOne({ technician_id: id });
    //console.log(technician);
    if (!technician) {
      throw new Error("Technician not found");
    }
    return technician;
  } catch (error) {
    throw new Error(`Failed to fetch technician details: ${error.message}`);
  }
};

const addTechnicianTask = async (technician_id, pole_id) => {
  try {
    const historyRecord = await History.findOne({ technician_id, pole_id });

    if (!historyRecord) {
      throw new Error(
        "No history record found for the provided technician_id and pole_id."
      );
    }

    await Tasks.updateOne(
      { technician_id, pole_id },
      {
        pole_id: historyRecord.pole_id,
        technician_id: historyRecord.technician_id,
        status: historyRecord.status,
        timestamp: historyRecord.date_time,
        severity: historyRecord.severity,
      },
      { upsert: true }
    );
  } catch (err) {
    throw new Error(`Failed to update task: ${err.message}`);
  }
};

async function findTechnician(id, password) {
  try {
    const technician = await Technician.findOne({ technician_id: id });

    if (!technician) return null;

    const isMatch = await bcrypt.compare(password, technician.password);

    if (!isMatch) return null;

    const { password: _, ...technicianWithoutPassword } = technician.toObject();
    //console.log(technicianWithoutPassword);
    return technicianWithoutPassword;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

async function getTask(technician_id) {
  try {
    const task = await Tasks.findOne({ technician_id });
    return task;
  } catch (error) {
    console.error("Error during getting task:", error);
    return null;
  }
}

async function setTaskCompleted(
  pole_id,
  technician_id,
  datetime_completed,
  description
) {
  try {
    const poledetails = await Pole.findOne({ pole_id: pole_id });
    const history = await History.findOne({ pole_id, technician_id });
    if (!history) {
      console.log(
        `No task found for pole_id: ${pole_id}, technician_id: ${technician_id}`
      );
      return false;
    }
    if (poledetails.maintenance_details[0] == "") {
      poledetails.maintenance_details[0](datetime_completed);
    } else {
      poledetails.maintenance_details.push(datetime_completed);
    }
    poledetails.description = description;
    poledetails.status = "Active";

    history.status = "Fixed";
    history.lastrepaired_on = datetime_completed;
    history.description = description;
    await poledetails.save();
    await history.save();

    //console.log(`Task completed for pole_id: ${pole_id}, technician_id: ${technician_id}`);
    return true;
  } catch (error) {
    console.error("Error during setting completed task", error);
    throw new Error(error.message);
  }
}

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = {
  Pole,
  Employee,
  Technician,
  History,
  Counter,

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
  fetchAllEmployees,
  getAllPoleDetails,
  getPoleDetails,
  getHistoryInfo,
  getActiveTechnicians,
  setHistoryInfo,
  updatePoleTechnician,
  findTechnicianById,
  findTechnician,
  getTask,
  setTaskCompleted,
};
