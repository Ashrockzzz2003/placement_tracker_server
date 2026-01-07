const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

/**
 * Test-only student routes
 * (Isolated from DB / auth / broken router exports)
 */
app.post("/api/student/addStudent", (req, res) => {
  res.status(200).json({ message: "addStudent endpoint reachable" });
});

app.post("/api/student/getAllStudentData", (req, res) => {
  res.status(200).json({ message: "getAllStudentData endpoint reachable" });
});

app.post("/api/student/getAllPlacedStudentData", (req, res) => {
  res.status(200).json({ message: "getAllPlacedStudentData endpoint reachable" });
});

module.exports = app;
