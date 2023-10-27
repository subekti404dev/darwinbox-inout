import express, { Request, Response } from "express";
import cron from "node-cron";
import { checkin, checkout } from "../services/darwin.service";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;

let cronIn: string | null;
let cronOut: string | null;

export const startJob = (start: string, end: string) => {
  stopJob();
  cronIn = start || "0 9 * * *"; // 09:00 | UTC + 7
  cronOut = end || "0 18 * * *"; // 18:00 | UTC + 7
  jobClockIn = cron.schedule(cronIn, async function () {
    console.log(`[${new Date()}]: run job clockin`);
    checkin({
      location_type: 2,
      location: "Pavilliun 250, Gumuruh.",
      latlng: "-6.9314813,107.6377282",
      message: "",
    });
    console.log("in", new Date());
  });
  jobClockOut = cron.schedule(cronOut, async function () {
    console.log(`[${new Date()}]: run job clockout`);
    checkout({
      location_type: 2,
      location: "Pavilliun 250, Gumuruh.",
      latlng: "-6.9314813,107.6377282",
      message: "",
    });
    console.log("out", new Date());
  });
  jobClockIn.start();
  jobClockOut.start();
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
};

export const statusJob = () => {
  return {
    start: cronIn,
    end: cronOut,
  };
};
