import express, { Request, Response } from "express";
import cron from "node-cron";
import { checkin, checkout } from "../services/darwin.service";
import { storeData } from "./store";
import { currentDayName } from "./day";
import { errParser } from "./errParser";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;

let cronIn: string | null;
let cronOut: string | null;

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
      location_type: data?.in?.type,
      location: data?.in?.location,
      latlng: data?.in?.latlng,
      message: data?.in?.message,
    };
    console.log(`[${new Date()}]: run job clockin`);
    console.log(payload);
    try {
      await checkin(payload);
    } catch (error) {
      const errMsg = errParser(error);
      console.log(`[Error]: ${errMsg}`);
    }
  });
  jobClockOut = cron.schedule(cronOut, async () => {
    if (await isSkipToday()) return;
    const data = storeData.getConfigData();
    const payload = {
      location_type: data?.out?.type,
      location: data?.out?.location,
      latlng: data?.out?.latlng,
      message: data?.out?.message,
    };
    console.log(`[${new Date()}]: run job clockout`);
    console.log(payload);
    try {
      await checkout(payload);
    } catch (error) {
      const errMsg = errParser(error);
      console.log(`[Error]: ${errMsg}`);
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
