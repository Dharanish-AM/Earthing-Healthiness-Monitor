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
  const sequence = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return prefix + sequence.sequence_value.toString().padStart(6, "0");
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
  },
  { timestamps: true }
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
  },
  { timestamps: true }
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
    const pole_id = await getNextSequenceValue("pole_id");
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

async function getAllEmployees() {
  try {
    const employees = await Employee.find();
    console.log("Employees:", employees);
    return employees;
  } catch (err) {
    console.error("Error fetching employees:", err);
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
  addEmployee,
  addTechnician,
  fetchPoleID,
  fetchPoleCords,
  getPoleDetails,
  assignTechnician,
  fetchHistory,
  getAllTechnicians,
  getAllEmployees,
  Login,
};
