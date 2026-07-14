import { Router } from "express";
import { getMoodleConfig, updateMoodleConfig } from "../controllers/moodleConfigController";
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get("/", getMoodleConfig);
router.put("/", authenticateToken, updateMoodleConfig);

export default router;
