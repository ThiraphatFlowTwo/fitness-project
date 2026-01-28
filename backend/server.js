const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require('./routes/adminRoutes')
const academicYearRoutes = require("./routes/academicYear.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/admin', adminRoutes)
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
