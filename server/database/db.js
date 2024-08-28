const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const poleSchema = new mongoose.Schema(
  {
    pole_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      default: uuidv4,
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
    last_maintenance: { type: Date, default: Date.now },
    total: { type: Number, default: 0, min: 0 },
    count: { type: Number, default: 0, min: 0 },
    daily_average: {
      type: [Number],
      validate: {
        validator: function (arr) {
          return arr.length <= 7;
        },
        message: "Daily average array can contain up to 7 values.",
      },
    },
  },
  { timestamps: true }
);

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      default: uuidv4,
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
  },
  { timestamps: true }
);

const technicianSchema = new mongoose.Schema(
  {
    technician_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
      default: uuidv4,
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
  },
  { timestamps: true }
);

const historySchema = new mongoose.Schema(
  {
    pole_id: { type: Number, required: true, index: true },
    date_time: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      required: true,
      enum: ["Fixed", "Pending", "In Progress"],
    },
    technician_id: { type: Number, required: true, index: true },
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
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new Employee({
      name,
      age,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    const savedEmployee = await newEmployee.save();
    console.log("Employee added:", savedEmployee);
  } catch (err) {
    console.error("Error adding employee:", err);
  }
}

async function addPole(pole_id, lat, long) {
  try {
    const pole = new Pole({
      pole_id,
      coordinates: [lat, long],
    });

    const result = await pole.save();
    console.log("Pole added:", result);
    return result;
  } catch (error) {
    console.error("Error while adding pole:", error);
  }
}

async function addTechnician(name, age, email, phone, address) {
  try {
    const technician_id = generateUniqueId();
    const technician = new Technician({
      technician_id,
      name,
      age,
      email,
      phone,
      address,
    });
    const savedTechnician = await technician.save();
    console.log("Technician added:", savedTechnician);
    return savedTechnician;
  } catch (err) {
    console.log("Error while adding technician:", err);
    throw err;
  }
}

async function fetchPoleID() {
  try {
    const Poles = await Pole.find();
    const PoleIDs = Poles.map((Pole) => Pole._id);
    console.log("Pole IDs:", PoleIDs);
    return PoleIDs;
  } catch (error) {
    console.error("Error fetching sensor IDs:", error);
  }
}

async function fetchPoleCords() {
  try {
    const Poles = await Pole.find();
    const PoleCords = Poles.map((Pole) => Pole.coordinates);
    console.log("Pole Coordinates:", PoleCords);
    return PoleCords;
  } catch (err) {
    console.error("Error fetching sensor cords:", err);
  }
}

async function getPoleDetails(Pole_id) {
  try {
    const pole = await Pole.findOne({ _id: Pole_id });

    if (!pole) {
      console.log("Pole not found");
      return null;
    }

    console.log("Pole Details:", Pole);
    return Pole;
  } catch (err) {
    console.error("Error fetching sensor details:", err);
  }
}

async function assignTechnician(Pole_id, technician_id) {
  try {
    const pole = await Pole.findOne({ _id: Pole_id });

    if (!pole) {
      console.log("pole not found");
      return null;
    }

    sensor.technician_id = technician_id;

    const updatedSensor = await Pole.save();

    console.log("Technician assigned:", updatedSensor);
    return updatedSensor;
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
    console.log("All Technicians:", technicians);
    return technicians;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
}

function generateUniqueId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month (01-12)
  const day = String(now.getDate()).padStart(2, "0"); // Day (01-31)
  const hour = String(now.getHours()).padStart(2, "0"); // Hour (00-23)
  const minute = String(now.getMinutes()).padStart(2, "0"); // Minute (00-59)
  const second = String(now.getSeconds()).padStart(2, "0"); // Second (00-59)

  return `${year}${month}${day}${hour}${minute}${second}`;
}

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = {
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
};
