import express, { Request, Response } from "express";
import cron from "node-cron";
import store from "store";

const router = express.Router();

let job: cron.ScheduledTask | null = null;

router.get("/start", (req: Request, res: Response) => {
  job = cron.schedule("* * * * *", async function () {
    store.set("date", new Date());
  });
  res.json({
    success: true,
  });
});

router.get("/stop", (req: Request, res: Response) => {
  if (!!job) {
    job.stop();
  }
  res.json({
    success: true,
  });
});

router.get("/value", (req: Request, res: Response) => {
  res.json({
    success: true,
    date: store.get("date", 0),
  });
});

export default router;
