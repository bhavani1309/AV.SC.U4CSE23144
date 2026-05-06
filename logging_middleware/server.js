const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const Log = async (
  stack,
  level,
  packageName,
  message
) => {

  try {

    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    console.log("Log Created:", response.data);

  } catch (error) {

    console.error(
      "Logging Failed:",
      error.message
    );

  }

};

let vehicles = [];

app.get("/", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Vehicle scheduler root accessed"
  );

  res.json({
    success: true,
    message: "Vehicle Maintenance Scheduler Running",
  });

});

app.post("/vehicles", async (req, res) => {

  const vehicle = req.body;

  vehicles.push(vehicle);

  await Log(
    "backend",
    "info",
    "controller",
    "Vehicle added successfully"
  );

  res.status(201).json({
    success: true,
    data: vehicle,
  });

});

app.get("/vehicles", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Fetched all vehicles"
  );

  res.json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });

});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

  console.log(
    `Vehicle Scheduler Running on ${PORT}`
  );

});