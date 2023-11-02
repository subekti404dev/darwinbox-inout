import express from "express";
import staticAuth from "../../middlewares/static-auth.routes";
import userRoutes from "./users.route";
import uptimeRoutes from "./uptime.route";
import jobRoutes from "./job.route";
import darwinRoutes from "./darwin.route";
import flagsRoutes from "./flags.route";

const router = express.Router();

router.use("/flags", flagsRoutes); // <-- public routes
router.use("/uptime", uptimeRoutes); // <-- public routes
router.use("/job", jobRoutes); // <-- public routes
router.use("/darwin", darwinRoutes); // <-- public routes
router.use("/users", staticAuth, userRoutes); // <-- private routes

export default router;
