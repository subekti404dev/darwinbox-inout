import express from "express";
import staticAuth from "../../middlewares/static-auth.routes";
import userRoutes from "./users.route";
import uptimeRoutes from "./uptime.route";

const router = express.Router();

router.use("/uptime", uptimeRoutes); // <-- public routes
router.use("/users", staticAuth, userRoutes); // <-- private routes

export default router;
