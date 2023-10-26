import express, { Request, Response } from "express";
import os from "os";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  let uptimeSec = os.uptime();
  let uptimeMin = uptimeSec / 60;
  let uptimeHour = uptimeMin / 60;

  uptimeSec = Math.floor(uptimeSec);
  uptimeMin = Math.floor(uptimeMin);
  uptimeHour = Math.floor(uptimeHour);

  uptimeHour = uptimeHour % 60;
  uptimeMin = uptimeMin % 60;
  uptimeSec = uptimeSec % 60;

  res.json({
    success: true,
    uptime: `${uptimeHour} Hour(s) ${uptimeMin} Minute(s) ${uptimeSec} Second(s)`,
    tz: process.env.TZ
  });
});

export default router;
