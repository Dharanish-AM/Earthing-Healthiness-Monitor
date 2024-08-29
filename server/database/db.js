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

const poleSchema = new mongoose.Schema(
  {
    pole_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
      enum: ["Active", "Inactive", "Under Maintenance"],
      default: "Active",
    },
    last_maintenance: { type: Date, default: null },
    total: { type: Number, default: 0, min: 0 },
    count: { type: Number, default: 0, min: 0 },
    daily_average: [{
      time: {
        type: Date,
        required: true,
      },
      current: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
  }
);

const employeeSchema = new mongoose.Schema(
  {
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
  }
);

const technicianSchema = new mongoose.Schema(
  {
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
  }
);

const historySchema = new mongoose.Schema(
  {
    pole_id: { type: String, required: true, index: true },
    date_time: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      required: true,
      enum: ["Fixed", "Pending", "In Progress"],
    },
    technician_id: { type: String, required: true, index: true },
    severity: { type: String, enum: ["Low", "Medium", "High"] },
    repaired_on: { type: Date, default: null },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const Pole = mongoose.model("Pole", poleSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Technician = mongoose.model("Technician", technicianSchema);
const History = mongoose.model("History", historySchema);

async function Login(employee_id, password) {
  try {
    const employee = await Employee.findOne({ employee_id });
    if (!employee) {
      console.log("Invalid User");
      return null;
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (isMatch) {
      console.log("User Valid");
      const token = jwt.sign(
        { employee_id: employee.employee_id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      console.log("JWT Token:", token);
      return token;
    } else {
      console.log("Invalid User");
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

    if (!password || typeof password !== 'string') {
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
    console.log("Technician added:", savedTechnician);
    return savedTechnician;
  } catch (err) {
    console.error("Error while adding technician:", err);
    throw err;
  }
}

async function addPole(lat, long) {
  try {
    const pole_id = await getNextSequenceValue("pole_id", "P");
    const pole = new Pole({
      pole_id,
      coordinates: [lat, long],
    });
    const result = await pole.save();
    console.log("Pole added:", result);
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
    console.log("Pole IDs:", PoleIDs);
    return PoleIDs;
  } catch (error) {
    console.error("Error fetching pole IDs:", error);
  }
}

async function fetchPoleCords() {
  try {
    const Poles = await Pole.find();
    const PoleCords = Poles.map((Pole) => Pole.coordinates);
    console.log("Pole Coordinates:", PoleCords);
    return PoleCords;
  } catch (err) {
    console.error("Error fetching pole cords:", err);
  }
}

async function getPoleDetails(pole_id) {
  try {
    const pole = await Pole.findOne({ pole_id });

    if (!pole) {
      console.log("Pole not found");
      return null;
    }

    console.log("Pole Details:", pole);
    return pole;
  } catch (err) {
    console.error("Error fetching pole details:", err);
  }
}

async function assignTechnician(pole_id, technician_id) {
  try {
    const pole = await Pole.findOne({ pole_id });

    if (!pole) {
      console.log("Pole not found");
      return null;
    }

    pole.technician_id = technician_id;

    const updatedPole = await pole.save();

    console.log("Technician assigned:", updatedPole);
    return updatedPole;
  } catch (err) {
    console.error("Error assigning technician:", err);
  }
}

async function fetchHistory() {
  try {
    const history = await History.find().sort({ date_time: -1 });
    console.log("History:", history);
    return history;
  } catch (error) {
    console.error("Error while fetching history:", error);
  }
}

async function getAllTechnicians() {
  try {
    const technicians = await Technician.find();
    console.log("Technicians:", technicians);
    return technicians;
  } catch (err) {
    console.error("Error fetching technicians:", err);
  }
}

async function fetchEmployeeDetails(emp_id) {
  try {
    const employee = await Employee.findOne({ employee_id: emp_id });
    if (!employee) {
      console.log("Employee not found");
      return null;
    }
    console.log("Employee Details:", employee);
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
      console.log("No employees found");
      return [];
    }
    console.log("Employee Details:", employees);
    return employees;
  } catch (err) {
    console.error("Error fetching employee details:", err);
    throw err;
  }
}


async function fetchPolesStatus() {
  try {
    const poles = await Pole.find({}, 'pole_id status');

    if (!poles || poles.length === 0) {
      console.log("No poles found");
      return [];
    }
    console.log("Pole Statuses:", poles);
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
    console.error('Error fetching active technicians:', error);
    throw error;
  }
}

async function fetchAllEmployees() {
  try {
    const employees = await Employee.find();
    console.log("All Employees:", employees);
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
      console.log(`Pole with ID ${pole_id} not found.`);
      return;
    }

    if (typeof current !== 'number' || current < 0) {
      console.log(`Invalid current value: ${current}. Must be a non-negative number.`);
      return;
    }

    const dateTime = new Date();
    pole.total += current;
    pole.count++;

    if (pole.count >= 4) {
      const avg = pole.total / pole.count;
      pole.daily_average.push({ time: dateTime, current: avg });
      pole.total = 0;
      pole.count = 0;
    }

    await pole.save();
    console.log(`Pole ID ${pole_id} updated successfully.`);

  } catch (err) {
    console.error("Error while setting current information:", err);
  }
}

async function fetchPoleChartData(pole_id) {
  try {
    const pole = await Pole.findOne({ pole_id });
    if (!pole) {
      console.log(`Pole with ID ${pole_id} not found.`);
      return null;
    }

    const poleChartdata = pole.daily_average;

    return poleChartdata;
  } catch (err) {
    console.error("Error while fetching pole chart data:", err);
    return null;
  }
}

async function getCurrentInfo(pole_id) {
  try {
    console.log("Searching for pole with ID:", pole_id);
    const pole = await Pole.find({ pole_id: "P000001" });
    console.log(pole)
    if (!pole) {
      console.error(`Pole not found for ID: ${pole_id}`);
      throw new Error("Pole not found");
    }

    const { timestamp, current } = pole.daily_average || {};
    //console.log(`Current info for pole ${pole_id}:`, { timestamp, current });
    return { timestamp, current };
  } catch (err) {
    console.error("Error in getCurrentInfo:", err);
    throw err;
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
};

