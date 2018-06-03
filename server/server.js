const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");
  socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat!"));
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user has joined the chat.")
  );

  socket.on("createMessage", message => {
    console.log("Create Message", message);
    // Emits to every single connection
    io.emit("newMessage", message);
    socket.broadcast.emit(
      "newMessage",
      generateMessage(message.from, message.text)
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log("Server is up on port:", port);
});
