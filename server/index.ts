import express, { json } from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

import authenticate from "./routes/authenticate";
import whiteboard from "./routes/whiteboard";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

const sessions = [];

app.use(json());
app.use(cors());

app.use("/whiteboard", authenticate, whiteboard);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("cursorPosition", (data) => {
    socket.broadcast.emit("otherUserCursor", data);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on PORT 3000");
});
