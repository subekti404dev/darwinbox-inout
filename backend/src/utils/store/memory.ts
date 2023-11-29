import path from "path";
import { IStore } from "./interface";
import {
  PathOrFileDescriptor,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { formatRFC3339 } from "date-fns";

const dataDir = path.join(process.cwd(), "data");
const filePathCfg = path.join(dataDir, "config.json");
const filePathLog = path.join(dataDir, "logs.json");

export class InMemoryStore implements IStore {
  private _cfgData: any = {};
  private _logs: any = [];
  constructor(defaultValue = {}) {
    this.initConfig(defaultValue);
  }

  private writeToFile(file: PathOrFileDescriptor, data: any) {
    writeFileSync(file, JSON.stringify(data, null, 3));
  }

  private loadFromFileCfg(file: PathOrFileDescriptor, defaultValue: any) {
    return JSON.parse(readFileSync(file, "utf-8") || defaultValue);
  }

  private initConfig(defaultValue: any = {}) {
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    if (!existsSync(filePathCfg)) {
      this._cfgData = defaultValue;
      this.writeToFile(filePathCfg, this._cfgData);
    } else {
      this._cfgData = this.loadFromFileCfg(filePathCfg, "{}");
      if (!this._cfgData.telegramBot) {
        this._cfgData.telegramBot = defaultValue.telegramBot;
        this.writeToFile(filePathCfg, this._cfgData);
      }
    }
    if (!existsSync(filePathLog)) {
      this.writeToFile(filePathLog, this._logs);
    } else {
      this._logs = this.loadFromFileCfg(filePathLog, "[]");
    }
  }

  public setConfigData(data: any) {
    this._cfgData = { ...this._cfgData, ...data };
    this.writeToFile(filePathCfg, this._cfgData);
  }

  public getConfigData() {
    return this._cfgData;
  }

  public addLogData(logData: any) {
    this._logs = [
      {
        date: formatRFC3339(new Date()),
        ...logData,
      },
      ...this._logs,
    ];
    this.writeToFile(filePathLog, this._logs);
  }

  public getLogData() {
    return this._logs;
  }
}
