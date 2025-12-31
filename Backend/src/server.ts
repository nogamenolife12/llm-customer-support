import express from "express";
import cors from "cors";
const app = express();
import chatRouter from "./routes/chat.route.js";

app.use(cors({
    origin: "https://llm-customer-support.vercel.app/",
    methods: ["GET", "POST"],
}))
app.use(express.json());
app.use("/chat", chatRouter);

export {app};