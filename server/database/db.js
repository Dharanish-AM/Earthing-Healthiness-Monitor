const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const poleSchema = new mongoose.Schema(
  {
    pole_id: { type: Number, required: true, unique: true, index: true },
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
    employee_id: { type: Number, required: true, unique: true, index: true },
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
    technician_id: { type: Number, required: true, unique: true, index: true },
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
      return;
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
    }
  } catch (err) {
    console.error("Error during login:", err);
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
    const technician = new Technician({
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
    console.error("Error while adding technician:", err);
  }
}

async function fetchSensorIDs() {
  try {
    const sensors = await Sensor.find();
    const sensorIDs = sensors.map((sensor) => sensor._id);
    console.log("Sensor IDs:", sensorIDs);
    return sensorIDs;
  } catch (error) {
    console.error("Error fetching sensor IDs:", error);
  }
}

async function fetchSensorCords() {
  try {
    const sensors = await Sensor.find();
    const sensorCords = sensors.map((sensor) => sensor.coordinates);
    console.log("Sensor Coordinates:", sensorCords);
    return sensorCords;
  } catch (err) {
    console.error("Error fetching sensor cords:", err);
  }
}

async function getSensorDetails(sensor_id) {
  try {
    const sensor = await Sensor.findOne({ _id: sensor_id });

    if (!sensor) {
      console.log("Sensor not found");
      return null;
    }

    console.log("Sensor Details:", sensor);
    return sensor;
  } catch (err) {
    console.error("Error fetching sensor details:", err);
  }
}

async function assignTechnician(sensor_id, technician_id) {
  try {
    const sensor = await Sensor.findOne({ _id: sensor_id });

    if (!sensor) {
      console.log("Sensor not found");
      return null;
    }

    sensor.technician_id = technician_id;

    const updatedSensor = await sensor.save();

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
  fetchSensorIDs,
  fetchSensorCords,
  getSensorDetails,
  assignTechnician,
  fetchHistory,
  getAllTechnicians,
};
