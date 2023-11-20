import express, { Request, Response } from "express";
import { startJob, stopJob, statusJob } from "../../utils/job";

const router = express.Router();

router.get("/start", (req: Request, res: Response) => {
  const { start, end } = req.query;
  const data = startJob(start as string, end as string);
  res.json({
    success: true,
    data,
  });
});

router.get("/stop", (req: Request, res: Response) => {
  stopJob();
  res.json({
    success: true,
    message: "job stopped",
  });
});

router.get("/status", (req: Request, res: Response) => {
  const data = statusJob();
  res.json({
    success: true,
    data,
  });
});

export default router;
