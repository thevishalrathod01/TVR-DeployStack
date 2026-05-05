import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Service from "./models/Service.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// JWT Middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Root
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ========= AUTH ========= */

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
  });

  res.json(user);
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token });
});

/* ========= SERVICES (PROTECTED) ========= */

// GET
app.get("/api/services", auth, async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

// POST
app.post("/api/services", auth, async (req, res) => {
  const { name, status } = req.body;

  const service = await Service.create({ name, status });

  res.json(service);
});

// UPDATE
app.put("/api/services/:id", auth, async (req, res) => {
  const { name, status } = req.body;

  const updated = await Service.findByIdAndUpdate(
    req.params.id,
    { name, status },
    { new: true }
  );

  res.json(updated);
});

// DELETE
app.delete("/api/services/:id", auth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Seed
app.get("/api/seed", async (req, res) => {
  await Service.deleteMany();

  await Service.insertMany([
    { name: "API Server", status: "UP" },
    { name: "Frontend", status: "UP" },
    { name: "Database", status: "DOWN" },
  ]);

  res.send("Seeded ✅");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});