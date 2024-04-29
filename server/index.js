import express from "express";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ... (We'll add the real-time cursor logic below)

// Assuming a static frontend for now

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle cursor position broadcasts from clients
  socket.on("cursorPosition", (data) => {
    socket.broadcast.emit("otherUserCursor", data); // Broadcast to all other clients
  });

  // Add logic for disconnecting users if needed
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
