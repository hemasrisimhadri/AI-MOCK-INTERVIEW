import { Router } from "express";

import { getInterviewFeedback } from "../controllers/aiController";

const router = Router();

router.post("/feedback", getInterviewFeedback);

export default router;