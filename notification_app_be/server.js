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

const getPriorityScore = (
  type,
  timestamp
) => {

  let score = 0;

  // Type priority
  if (type === "Placement") {
    score += 100;
  }
  else if (type === "Result") {
    score += 70;
  }
  else if (type === "Event") {
    score += 40;
  }

  // Recency priority
  const currentTime =
    new Date().getTime();

  const notificationTime =
    new Date(timestamp).getTime();

  const hoursDifference =
    (currentTime - notificationTime)
    / (1000 * 60 * 60);

  score += Math.max(
    0,
    50 - hoursDifference
  );

  return score;

};

app.get(
  "/priority-notifications",
  async (req, res) => {

    try {

      await Log(
        "backend",
        "info",
        "route",
        "Fetching priority notifications"
      );

      const response =
        await axios.get(
          `${BASE_URL}/notifications`,
          {
            headers: {
              Authorization:
                `Bearer ${process.env.ACCESS_TOKEN}`,
            },
          }
        );

      const notifications =
        response.data.notifications;

      // Calculate priority
      const prioritized =
        notifications.map(
          (notification) => {

            return {
              ...notification,
              priorityScore:
                getPriorityScore(
                  notification.Type,
                  notification.Timestamp
                ),
            };

          }
        );

      // Sort descending
      prioritized.sort(
        (a, b) =>
          b.priorityScore
          - a.priorityScore
      );

      // Top 10
      const topNotifications =
        prioritized.slice(0, 10);

      await Log(
        "backend",
        "info",
        "service",
        "Priority notifications generated"
      );

      return res.status(200).json({
        success: true,
        count:
          topNotifications.length,
        data: topNotifications,
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
        message:
          "Internal Server Error",
      });

    }

  }
);

const PORT =
  process.env.PORT || 5005;

app.listen(PORT, () => {

  console.log(
    `Notification App Running on ${PORT}`
  );

});