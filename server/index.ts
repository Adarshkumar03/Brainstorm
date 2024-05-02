import express, { json } from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv"

import authenticate from "./routes/authenticate";
import whiteboard from "./routes/whiteboard";

dotenv.config();
const app = express();
const server = http.createServer(app);

const sessions = [];

app.use(json());
app.use(cors());

app.use("/whiteboard", authenticate, whiteboard)

server.listen(3000, () => {
  console.log("listening on PORT 3000");
});
