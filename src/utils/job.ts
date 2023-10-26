import express, { Request, Response } from "express";
import cron from "node-cron";
import { checkin, checkout } from "../services/darwin.service";

let jobClockIn: cron.ScheduledTask | null = null;
let jobClockOut: cron.ScheduledTask | null = null;

export const startJob = (start: string, end: string) => {
  stopJob();
  const defaultStart = "0 2 * * *"; // 09:00 | UTC + 7
  const defaultEnd = "0 11 * * *"; // 18:00 | UTC + 7
  jobClockIn = cron.schedule(start || defaultStart, async function () {
    checkin({
      location_type: 2,
      location: "Pavilliun 250, Gumuruh.",
      latlng: "-6.9314813,107.6377282",
      message: "",
    });
    // console.log("in", new Date());
  });
  jobClockOut = cron.schedule(end || defaultEnd, async function () {
    checkout({
      location_type: 2,
      location: "Pavilliun 250, Gumuruh.",
      latlng: "-6.9314813,107.6377282",
      message: "",
    });
    // console.log("out", new Date());
  });
  jobClockIn.start();
  jobClockOut.start();
  return {
    start: start || defaultStart,
    end: end || defaultEnd,
  };
};

export const stopJob = () => {
  if (!!jobClockIn) {
    jobClockIn.stop();
    jobClockIn = null;
  }
  if (!!jobClockOut) {
    jobClockOut.stop();
    jobClockOut = null;
  }
};
