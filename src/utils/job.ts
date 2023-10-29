import cron from "node-cron";
import { checkin, checkout } from "../services/darwin.service";
import { storeData } from "./store";
import { currentDayName } from "./day";
import { errParser } from "./errParser";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;

let cronIn: string | null;
let cronOut: string | null;

export enum CheckType {
  In = "checkin",
  Out = "checkout",
}

const isSkipToday = async () => {
  // skip weekend
  if (["Sabtu", "Minggu"].includes(currentDayName)) {
    console.log("Skip, today is weekend :)");

    return true;
  }
  return false;
};

export const startJob = (start: string, end: string) => {
  stopJob();
  cronIn = start || "0 9 * * *"; // 09:00 | UTC + 7
  cronOut = end || "0 18 * * *"; // 18:00 | UTC + 7
  const currData = storeData.getConfigData();
  storeData.setConfigData({ ...currData, cronIn, cronOut });

  jobClockIn = cron.schedule(cronIn, async () => {
    if (await isSkipToday()) return;
    const data = storeData.getConfigData();
    const payload = {
      locationType: data?.in?.type,
      location: data?.in?.location,
      latlng: data?.in?.latlng,
      message: data?.in?.message,
    };
    console.log(`[${new Date()}]: run job clockin`);
    console.log(payload);
    try {
      await checkin(payload);
      storeData.addLogData({
        ...payload,
        type: CheckType.In,
        status: 200,
        errMsg: null,
      });
    } catch (error: any) {
      const errMsg = errParser(error);
      const reqStatus = error?.response?.status;
      storeData.addLogData({
        ...payload,
        type: CheckType.In,
        status: reqStatus,
        errMsg,
      });
      console.log(`[Error]${reqStatus && `[${reqStatus}]`}: ${errMsg}`);
    }
  });
  jobClockOut = cron.schedule(cronOut, async () => {
    if (await isSkipToday()) return;
    const data = storeData.getConfigData();
    const payload = {
      locationType: data?.out?.type,
      location: data?.out?.location,
      latlng: data?.out?.latlng,
      message: data?.out?.message,
    };
    console.log(`[${new Date()}]: run job clockout`);
    console.log(payload);
    try {
      await checkout(payload);
      storeData.addLogData({
        ...payload,
        type: CheckType.Out,
        status: 200,
        errMsg: null,
      });
    } catch (error: any) {
      const errMsg = errParser(error);
      const reqStatus = error?.response?.status;
      storeData.addLogData({
        ...payload,
        type: CheckType.Out,
        status: reqStatus,
        errMsg,
      });
      console.log(`[Error]${reqStatus && `[${reqStatus}]`}: ${errMsg}`);
    }
  });
  jobClockIn.start();
  jobClockOut.start();

  console.log(`Job started ! [${cronIn}, ${cronOut}]`);

  return {
    start: cronIn,
    end: cronOut,
  };
};

export const stopJob = () => {
  if (!!jobClockIn) {
    jobClockIn.stop();
    jobClockIn = null;
    cronIn = null;
  }
  if (!!jobClockOut) {
    jobClockOut.stop();
    jobClockOut = null;
    cronOut = null;
  }
  storeData.setConfigData({ ...storeData.getConfigData(), cronIn, cronOut });
};

export const statusJob = () => {
  return {
    start: cronIn,
    end: cronOut,
  };
};
