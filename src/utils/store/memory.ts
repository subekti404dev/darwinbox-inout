import path from "path";
import { IStore } from "./interface";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
const root = process.cwd();
const fileDir = path.join(root, "data");
const fileNameCfg = "config.json";
const filePathCfg = path.join(fileDir, fileNameCfg);

export class InMemoryStore implements IStore {
  private _cfgData: any = {};
  constructor(defaultValue = {}) {
    this.initConfig(defaultValue);
  }

  private writeToFileCfg() {
    writeFileSync(filePathCfg, JSON.stringify(this._cfgData, null, 3));
  }

  private loadFromFileCfg() {
    this._cfgData = JSON.parse(readFileSync(filePathCfg, "utf-8") || "{}");
  }

  private initConfig(defaultValue: any = {}) {
    if (!existsSync(fileDir)) mkdirSync(fileDir, { recursive: true });
    if (!existsSync(filePathCfg)) {
      this._cfgData = defaultValue;
      this.writeToFileCfg();
    } else {
      this.loadFromFileCfg();
    }
  }

  public setConfigData(data: any) {
    this._cfgData = { ...this._cfgData, ...data };
    this.writeToFileCfg();
  }

  public getConfigData() {
    return this._cfgData;
  }
}
