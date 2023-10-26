import express, { Request, Response } from "express";
import store from "store";
import { checkin, checkout, login } from "../../services/darwin.service";

const router = express.Router();

const handleError = (error: any, res: any) => {
  const errMsg =
    error?.response?.data?.message ||
    (!!error?.response?.data && JSON.stringify(error?.response?.data)) ||
    error.message;
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
    data: store.get("login-data"),
  });
});

router.post("/set-login-data", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.token) throw new Error("invalid data");
    store.set("login-data", data);
    res.json({
      success: true,
      data: store.get("login-data"),
    });
  } catch (error: any) {
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
