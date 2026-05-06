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
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdi5zYy51NGNzZTIzMTQ0QGF2LnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjAwOTIsImlhdCI6MTc3ODA1OTE5MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImFmMDMyN2U4LWE4MTQtNDM5OC1hMjQxLWU4OWRjODI3MDFkYiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InQuYmhhdmFuaSIsInN1YiI6IjRhNjM3ZGI5LWVlODUtNDNkZC1iNzMzLTI2M2Q2NTlhNDE3NSJ9LCJlbWFpbCI6ImF2LnNjLnU0Y3NlMjMxNDRAYXYuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJ0LmJoYXZhbmkiLCJyb2xsTm8iOiJhdi5zYy51NGNzZTIzMTQ0IiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiNGE2MzdkYjktZWU4NS00M2RkLWI3MzMtMjYzZDY1OWE0MTc1IiwiY2xpZW50U2VjcmV0Ijoia1RQVnhOa1RucXVaZlJaRSJ9.UM0sIbySaoGf4n8juOY7yE0xgwLG-JCJZp2W_2G_ffQ`,
        },
      }
    );

    console.log("Log Created:", response.data);
  } catch (error) {
    console.error("Logging Failed:", error.message);
  }
};

module.exports = Log;