import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authroutes from "./routes/auth.routes.js";
import adminroutes from "./routes/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/admin", adminroutes);

export { app };
