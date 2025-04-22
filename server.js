const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./Utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomMembers,
} = require("./Utils/users");
const botname = "GodSlayer -- Admin";
// omkar is gay
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome single user
    socket.emit("message", formatMessage(botname, "Welcome to the ChatApp"));
    // broadcast to all the users (usually when a user connects)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${username} has joined the chat`)
      );
    // Send the users and the room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomMembers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botname, `${user.username}  has left the chat`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomMembers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`Your future runs on the Port :- ${PORT}`)
);
