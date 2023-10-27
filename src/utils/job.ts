import express, { Request, Response } from "express";
import cron from "node-cron";
import { checkin, checkout } from "../services/darwin.service";
import { storeData } from "./store";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;

let cronIn: string | null;
let cronOut: string | null;

export const startJob = (start: string, end: string) => {
  stopJob();
  cronIn = start || "0 9 * * *"; // 09:00 | UTC + 7
  cronOut = end || "0 18 * * *"; // 18:00 | UTC + 7
  const currData = storeData.getData();
  storeData.setData({ ...currData, cronIn, cronOut });

  jobClockIn = cron.schedule(cronIn, async function () {
    const data = storeData.getData();
    const payload = {
      location_type: data?.in?.type,
      location: data?.in?.location,
      latlng: data?.in?.latlng,
      message: data?.in?.message,
    };
    console.log(`[${new Date()}]: run job clockin`);
    console.log(payload);
    checkin(payload);
  });
  jobClockOut = cron.schedule(cronOut, async function () {
    const data = storeData.getData();
    const payload = {
      location_type: data?.out?.type,
      location: data?.out?.location,
      latlng: data?.out?.latlng,
      message: data?.out?.message,
    };
    console.log(`[${new Date()}]: run job clockout`);
    console.log(payload);
    checkout(payload);
  });
  jobClockIn.start();
  jobClockOut.start();

  console.log(`Job started ! [${checkin}, ${checkout}]`);

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
  storeData.setData({ ...storeData.getData(), cronIn, cronOut });
};

export const statusJob = () => {
  return {
    start: cronIn,
    end: cronOut,
  };
};
