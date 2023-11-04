import cron from "node-cron";
import wait from "wait";
import { checkin, checkout } from "../services/darwin.service";
import { storeData } from "./store";
import { currentDate, currentDayName } from "./day";
import { errParser } from "./errParser";
import { millisecondsToMinutes, minutesToMilliseconds } from "date-fns";

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
  if (["Sabtu", "Minggu"].includes(currentDayName())) {
    console.log("Skip, today is weekend :)");
    return true;
  }

  // skip holidays
  const currData = storeData.getConfigData();
  if ((currData?.holidays || []).includes(currentDate())) {
    console.log("Skip, today is holidays :)");
    return true;
  }
  return false;
};

const doDelay = async () => {
  const data = storeData.getConfigData();
  if (data?.randomizeDelay && data?.delay > 0) {
    const delayInMinutes = millisecondsToMinutes(data.delay);
    const randomDelayInMinutes = Math.floor(
      Math.random() * (delayInMinutes + 1)
    );
    console.log(`Job random delayed on: ${randomDelayInMinutes} minutes`);
    await wait(minutesToMilliseconds(randomDelayInMinutes));
  }
};

export const startJob = (start?: string, end?: string) => {
  stopJob();
  const currData = storeData.getConfigData();
  cronIn = start || currData.cronIn || "0 9 * * *"; // 09:00 | UTC + 7
  cronOut = end || currData.cronOut || "0 18 * * *"; // 18:00 | UTC + 7
  storeData.setConfigData({ ...currData, cronIn, cronOut, scheduler: true });

  jobClockIn = cron.schedule(cronIn as string, async () => {
    if (await isSkipToday()) return;
    const data = storeData.getConfigData();
    const payload = {
      location_type: data?.in?.type,
      location: data?.in?.location,
      latlng: data?.in?.latlng,
      message: data?.in?.message,
    };

    // do random delay
    await doDelay();

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
  jobClockOut = cron.schedule(cronOut as string, async () => {
    if (await isSkipToday()) return;
    const data = storeData.getConfigData();
    const payload = {
      location_type: data?.out?.type,
      location: data?.out?.location,
      latlng: data?.out?.latlng,
      message: data?.out?.message,
    };

    // do random delay
    await doDelay();

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
  storeData.setConfigData({
    ...storeData.getConfigData(),
    cronIn,
    cronOut,
    scheduler: false,
  });
  console.log(`Job stopped !`);
};

export const statusJob = () => {
  return {
    start: cronIn,
    end: cronOut,
  };
};
