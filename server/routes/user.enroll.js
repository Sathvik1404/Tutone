import express from "express";
import { enrollCourse } from "../controllers/enrollController.js";

const router = express.Router();

router.post("/enroll-course", enrollCourse);

export default router;
