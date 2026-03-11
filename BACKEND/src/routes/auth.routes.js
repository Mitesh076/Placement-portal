import express from "express";
import authcontroller from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authcontroller.registerUser);
router.post("/login", authcontroller.loginUser);

export default router;
