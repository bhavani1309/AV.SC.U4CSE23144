const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const BASE_URL =
  "http://20.207.122.201/evaluation-service";

const Log = async (
  stack,
  level,
  packageName,
  message
) => {

  try {

    await axios.post(
      `${BASE_URL}/logs`,
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

  } catch (error) {

    console.error(
      "Logging Failed:",
      error.message
    );

  }

};

app.get("/schedule", async (req, res) => {

  try {

    await Log(
      "backend",
      "info",
      "route",
      "Vehicle scheduling started"
    );

    // Fetch depots
    const depotResponse = await axios.get(
      `${BASE_URL}/depots`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    // Fetch vehicles/tasks
    const vehicleResponse = await axios.get(
      `${BASE_URL}/vehicles`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    const depots =
      depotResponse.data.depots;

    const vehicles =
      vehicleResponse.data.vehicles;

    // Sort tasks by highest impact first
    vehicles.sort(
      (a, b) => b.Impact - a.Impact
    );

    const result = [];

    for (const depot of depots) {

      let remainingHours =
        depot.MechanicHours;

      let assignedTasks = [];

      let totalImpact = 0;

      for (const vehicle of vehicles) {

        if (
          !vehicle.assigned &&
          vehicle.Duration <= remainingHours
        ) {

          assignedTasks.push(vehicle);

          remainingHours -=
            vehicle.Duration;

          totalImpact +=
            vehicle.Impact;

          vehicle.assigned = true;

        }

      }

      result.push({
        depotId: depot.ID,
        totalImpact,
        remainingHours,
        assignedTasks,
      });

    }

    await Log(
      "backend",
      "info",
      "service",
      "Vehicle scheduling completed"
    );

    return res.status(200).json({
      success: true,
      totalDepots: result.length,
      data: result,
    });

  } catch (error) {

    await Log(
      "backend",
      "error",
      "service",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {

  console.log(
    `Vehicle Scheduler Running on ${PORT}`
  );

});