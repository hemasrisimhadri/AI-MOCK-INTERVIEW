import { Router } from "express";
import { getInterviewQuestions } from "../controllers/interviewController";

const router = Router();

router.get("/questions", getInterviewQuestions);

export default router;