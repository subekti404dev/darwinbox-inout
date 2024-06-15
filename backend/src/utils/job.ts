import cron from "node-cron";
import wait from "wait";
import { checkin, checkout } from "../services/darwin.service";
import { storeData } from "./store";
import { currentDate, currentDayName } from "./day";
import { errParser } from "./errParser";
import { millisecondsToMinutes, minutesToMilliseconds, format, addDays } from "date-fns";
import { notifyMe, sendMessage } from "../services/telegram.service";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;
let jobExpiredReminder: cron.ScheduledTask | null = null;

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

const generatePayload = async (type: "in" | "out") => {
  const data = storeData.getConfigData();
  const message = data?.[type]?.message;
  if (data?.randomizeLocation && data?.locations?.length > 0) {
    const max = data?.locations?.length - 1;
    const min = 0;
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
    const location = data?.locations?.[randomIndex];
    if (location) {
      return {
        location_type: location?.type,
        location: location?.location,
        latlng: location?.latlng,
        message,
      };
    }
  }
  return {
    location_type: data?.[type]?.type,
    location: data?.[type]?.location,
    latlng: data?.[type]?.latlng,
    message,
  };
};

export const startJob = (start?: string, end?: string) => {
  stopJob();
  const currData = storeData.getConfigData();
  cronIn = start || currData.cronIn || "0 9 * * *"; // 09:00 | UTC + 7
  cronOut = end || currData.cronOut || "0 18 * * *"; // 18:00 | UTC + 7
  storeData.setConfigData({ ...currData, cronIn, cronOut, scheduler: true });

  jobClockIn = cron.schedule(cronIn as string, async () => {
    if (await isSkipToday()) return;
    const payload = await generatePayload("in");

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
      notifyMe({
        type: "checkin",
        status: "success",
        data: JSON.stringify(payload, null, 2),
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
      notifyMe({
        type: "checkin",
        status: "failed",
        data: JSON.stringify({ error: errMsg }, null, 2),
      });
    }
  });
  jobClockOut = cron.schedule(cronOut as string, async () => {
    if (await isSkipToday()) return;
    const payload = await generatePayload("out");

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
      notifyMe({
        type: "checkout",
        status: "success",
        data: JSON.stringify(payload, null, 2),
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
      notifyMe({
        type: "checkout",
        status: "failed",
        data: JSON.stringify({ error: errMsg }, null, 2),
      });
    }
  });
  jobClockIn.start();
  jobClockOut.start();
  startExpiredReminder();
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
    // cronIn,
    // cronOut,
    scheduler: false,
  });
  stopExpiredRemiderJob();
  console.log(`Job stopped !`);
};

export const statusJob = () => {
  return {
    start: cronIn,
    end: cronOut,
  };
};

export const startExpiredReminder = () => {
  stopExpiredRemiderJob();
  const currData = storeData.getConfigData();
  const expiredDate = format(new Date(currData.expires * 1000), "yyyy-MM-dd");
  const tomorrowDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
  
  jobExpiredReminder = cron.schedule("40 8 * * *", async () => {
    if (expiredDate === tomorrowDate) {
        console.log({ expiredDate, tomorrowDate });
        sendMessage({ message: `Darwinbox token will expire tomorrow: ${expiredDate}` });
    }
  });

  jobExpiredReminder.start();
  console.log(`Exp Remider Job started !`);
};

export const stopExpiredRemiderJob = () => {
  if (!!jobExpiredReminder) {
    jobExpiredReminder.stop();
    jobExpiredReminder = null;
  }

  console.log(`Exp Remindder Job stopped !`);
};
