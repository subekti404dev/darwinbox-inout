import express, { Request, Response } from "express";
import {
  checkin,
  checkout,
  getLastCheckin,
  login,
} from "../../services/darwin.service";
import { storeData } from "../../utils/store";
import { errParser } from "../../utils/errParser";
import { startJob, stopJob } from "../../utils/job";

const router = express.Router();

const handleError = (error: any, res: any) => {
  const errMsg = errParser(error);
  res
    .status(error?.response?.status || 400)
    .json({ success: false, message: errMsg });
};

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { qrcode, host } = req.body || {};
    const data = await login({ qrcode, host });

    if (!data.token) throw new Error(data.message);

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

router.get("/login-data", async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: storeData.getConfigData(),
  });
});

router.get("/histories", async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: storeData.getLogData(),
  });
});

router.post("/set-login-data", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.token) throw new Error("invalid data");
    storeData.setConfigData(data);
    if (data.scheduler) {
      startJob(data.cronIn, data.cronOut);
    } else {
      stopJob();
    }
    res.json({
      success: true,
      data: storeData.getConfigData(),
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

router.get("/last-checkin", async (req: Request, res: Response) => {
  try {
    const data = await getLastCheckin();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/is-token-alive", async (req: Request, res: Response) => {
  try {
    await getLastCheckin();
    res.json({
      success: true,
      message: "Token Alive",
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/checkin", async (req: Request, res: Response) => {
  try {
    const { location_type, message, latlng, location } = req.body || {};
    const data = await checkin({ location_type, message, latlng, location });

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { location_type, message, latlng, location } = req.body || {};
    const data = await checkout({ location_type, message, latlng, location });

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

export default router;
