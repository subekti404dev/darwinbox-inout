import express from "express";
import uptimeRoutes from "./uptime.route";
import jobRoutes from "./job.route";
import darwinRoutes from "./darwin.route";
import flagsRoutes from "./flags.route";
import authRoutes from "./auth.route";
import tokenAuth from "middlewares/token-auth.routes";

const router = express.Router();

router.use("/auth", authRoutes); 
router.use("/flags", flagsRoutes); 
router.use("/uptime", tokenAuth, uptimeRoutes); 
router.use("/job", tokenAuth, jobRoutes); 
router.use("/darwin", tokenAuth, darwinRoutes); 

export default router;
