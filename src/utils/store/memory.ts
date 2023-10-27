import path from "path";
import { IStore } from "./interface";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import appRoot from "app-root-path";
const fileDir = path.join(appRoot.path, "data");
const fileName = "config.json";
const filePath = path.join(fileDir, fileName);

export class InMemoryStore implements IStore {
  private data: any = null;
  constructor() {
    this.init();
  }

  private writeToFile() {
    writeFileSync(filePath, JSON.stringify(this.data, null, 3));
  }

  private loadToFile() {
    this.data = JSON.parse(readFileSync(filePath, "utf-8") || "{}");
  }

  private init() {
    this.data = {};
    if (!existsSync(fileDir)) mkdirSync(fileDir, { recursive: true });
    if (!existsSync(filePath)) {
      this.writeToFile();
    } else {
      this.loadToFile();
    }
  }

  public setData(data: any) {
    this.data = data;
    this.writeToFile();
  }

  public getData() {
    return this.data;
  }
}
