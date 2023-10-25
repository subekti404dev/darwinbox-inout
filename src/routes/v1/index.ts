import express from "express";
import staticAuth from "../../middlewares/static-auth.routes";
import userRoutes from "./users.route";
import uptimeRoutes from "./uptime.route";
import jobRoutes from "./job.route";

const router = express.Router();

router.use("/uptime", uptimeRoutes); // <-- public routes
router.use("/job", jobRoutes); // <-- public routes
router.use("/users", staticAuth, userRoutes); // <-- private routes

export default router;
