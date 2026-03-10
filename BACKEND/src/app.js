import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authroutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authroutes);

export { app };
