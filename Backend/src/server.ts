import express from "express";
import cors from "cors";
const app = express();
import chatRouter from "./routes/chat.route.js";

app.use(cors({
    origin: ["https://llm-customer-support.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
}))
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use("/chat", chatRouter);

export {app};