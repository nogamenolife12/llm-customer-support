import express from "express";
const app = express();
import chatRouter from "./routes/chat.route.js";

app.use(express.json());
app.use("/chat", chatRouter);

export {app};