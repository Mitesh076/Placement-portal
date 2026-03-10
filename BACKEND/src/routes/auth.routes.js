import express from "express";
import authcontroller from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authcontroller.registerUser);

export default router;
