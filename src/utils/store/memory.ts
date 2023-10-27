import path from "path";
import { IStore } from "./interface";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import appRoot from "app-root-path";
import { startJob } from "../job";
const fileDir = path.join(appRoot.path, "data");
const fileName = "config.json";
const filePath = path.join(fileDir, fileName);

export class InMemoryStore implements IStore {
  private data: any = {};
  constructor(defaultValue = {}) {
    this.init(defaultValue);
  }

  private writeToFile() {
    writeFileSync(filePath, JSON.stringify(this.data, null, 3));
  }

  private loadToFile() {
    this.data = JSON.parse(readFileSync(filePath, "utf-8") || "{}");
  }

  private init(defaultValue: any = {}) {
    if (!existsSync(fileDir)) mkdirSync(fileDir, { recursive: true });
    if (!existsSync(filePath)) {
      this.data = defaultValue;
      this.writeToFile();
    } else {
      this.loadToFile();
    }
    if (this.data?.cronIn && this.data?.cronOut) {
      startJob(this.data?.cronIn, this.data?.cronOut);
    }
  }

  public setData(data: any) {
    this.data = { ...this.data, ...data };
    this.writeToFile();
  }

  public getData() {
    return this.data;
  }
}
