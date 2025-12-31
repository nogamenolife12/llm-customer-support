import express from "express";
import cors from "cors";
const app = express();
import chatRouter from "./routes/chat.route.js";

app.use(cors({
    origin: ['http://localhost:5173/', 'https://llm-customer-support.onrender.com'],
    methods: ["GET", "POST"],
}))
app.use(express.json());
app.use("/chat", chatRouter);

export {app};