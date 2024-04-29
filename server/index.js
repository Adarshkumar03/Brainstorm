import express from "express";
import session from "express-session";
import Keycloak from "keycloak-connect";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("cursorPosition", (data) => {
    socket.broadcast.emit("otherUserCursor", data);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
