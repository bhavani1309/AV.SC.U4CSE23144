const axios = require("axios");

const Log = async (stack, level, packageName, message) => {
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
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      }
    );

    console.log("Log Created:", response.data);
  } catch (error) {
    console.error("Logging Failed:", error.message);
  }
};

module.exports = Log;