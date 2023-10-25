import express, { Request, Response } from "express";

import Axios from "axios";
import store from "store";
import { base64encode } from "nodejs-base64";

const router = express.Router();

const handleError = (error: any, res: any) => {
  const errMsg =
    error?.response?.data?.message ||
    (!!error?.response?.data && JSON.stringify(error?.response?.data)) ||
    error.message;
  res.status(400).json({ success: false, message: errMsg });
};

const getHeaders = (host: string) => ({
  "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Redmi Note 5 MIUI/9.6.27)",
  Host: host,
  Connection: "Keep-Alive",
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { qrcode, host } = req.body || {};
    const payload = {
      qrcode,
      udid: "",
    };

    const { data } = await Axios.post(
      `https://${host}/Mobileapi/auth`,
      payload,
      {
        headers: getHeaders(host),
      }
    );

    if (!data.token) throw new Error(data.message);

    store.set("login-data", { ...data, host });

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

    if (!location_type || !latlng)
      throw new Error(`location_type and latlng is required!`);

    const loginData = store.get("login-data", {});
    if (!loginData?.token) throw new Error("You are not logged in ");

    const payload = {
      token: loginData.token,
      location: base64encode(location || latlng),
      latlng,
      message,
      location_type: location_type || 2, // 1 for Office, 2 for Home, 3 for Field Duty
      in_out: 1,
      udid: "",
      purpose: "",
    };

    const { data } = await Axios.post(
      `https://${loginData.host}/Mobileapi/CheckInPost`,
      payload,
      {
        headers: getHeaders(loginData.host),
      }
    );

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

    if (!location_type || !latlng)
      throw new Error(`location_type and latlng is required!`);

    const loginData = store.get("login-data", {});
    if (!loginData?.token) throw new Error("You are not logged in ");

    const { data: lastCheckInData } = await Axios.post(
      `https://${loginData.host}/Mobileapi/LastCheckIndeatils`,
      { token: loginData.token },
      {
        headers: getHeaders(loginData.host),
      }
    );

    if (!lastCheckInData?.message?.id)
      throw new Error(JSON.stringify(lastCheckInData));

    const payload = {
      checkin_id: lastCheckInData?.message?.id,
      token: loginData.token,
      location: base64encode(location || latlng),
      latlng,
      message,
      location_type: location_type || 2, // 1 for Office, 2 for Home, 3 for Field Duty
      in_out: 2,
      udid: "",
      purpose: "",
    };

    const { data } = await Axios.post(
      `https://${loginData.host}/Mobileapi/CheckInPost`,
      payload,
      {
        headers: getHeaders(loginData.host),
      }
    );

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    handleError(error, res);
  }
});

export default router;
