const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");

// Create an express app
const app = express();

// Create a server and attach it to the app
const server = http.createServer(app);

// Create a Socket.IO instance, passing our server
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5000",
  })
);

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Define your static files route
app.use(express.static("public"));

module.exports = { io, server };
