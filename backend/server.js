const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require('./routes/adminRoutes')
const instructorRoutes = require("./routes/instructorRoutes");
const academicYearRoutes = require("./routes/academicYear.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const exerciseRoutes = require("./routes/exercise.routes");
const traineeRoutes = require("./routes/traineeRoutes");
const fitnessRoutes = require("./routes/physicalFitnessRoutes");
const programRoutes = require("./routes/programRoutes");
const trainingLogRoutes = require("./routes/trainingLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const path = require("path");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/admin', adminRoutes)
app.use("/api/instructor", instructorRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/trainees", traineeRoutes);
app.use("/api/fitness", fitnessRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/logs", trainingLogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));