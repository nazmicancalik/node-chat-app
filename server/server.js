const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const message = require("../utils/message.js");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("createMessage", message => {
    console.log("Create Message", message);

    socket.emit("newMessage", {
      from: "Admin",
      text: "Welcome to the chat app",
      createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newMessage", {
      from: "Admin",
      text: "New user has joined the chat",
      createdAt: new Date().getTime()
    });

    // Emits to every single connection
    io.emit("newMessage", message);
    socket.broadcast.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log("Server is up on port:", port);
});
