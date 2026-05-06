const express = require("express");
const cors = require("cors");

require("dotenv").config();
const Log = require("./utils/log");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Root API accessed"
  );

  res.json({
    success: true,
    message: "Backend Running Successfully",
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});