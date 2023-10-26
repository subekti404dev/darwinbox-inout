import dotenv from "dotenv";
dotenv.config();

import store from "store";
import pg from "pg";
const key = "login-data";
const { Pool } = pg;
export const pool = process.env.POSTGRES_URL
  ? new Pool({
      connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
  : null;

export interface IStore {
  setLoginData: (data: any) => void;
  getLoginData: () => any;
}

class InMemoryStore implements IStore {
  private data: any = null;
  constructor() {
    this.init();
  }

  private init() {
    this.data = store.get(key) || {};
  }

  public setLoginData(data: any) {
    this.data = data;
    store.set(key, data);
  }

  public getLoginData() {
    return this.data;
  }
}

class PGStore implements IStore {
  private data: any = {};
  constructor() {
    this.init();
  }

  private async init() {
    await pool?.query(`
      CREATE TABLE IF NOT EXISTS darwin_data (
        key VARCHAR(50),
        value VARCHAR(1000)
      );
    `);
    const { rows } = await pool?.query<any>(`
      SELECT * FROM darwin_data WHERE key = '${key}'
    `);

    if (!rows?.[0]) {
      await pool?.query(
        `INSERT INTO darwin_data (key, value) VALUES ('${key}', '${JSON.stringify(
          this.data
        )}')`
      );
    } else {
      this.data = JSON.parse(rows?.[0]?.value);
    }
  }

  public setLoginData(data: any) {
    this.data = data;
    pool?.query(
      `UPDATE darwin_data SET value='${JSON.stringify(
        data
      )}' WHERE key='${key}'`
    );
  }

  public getLoginData() {
    return this.data;
  }
}

export const storeData = process.env.POSTGRES_URL
  ? new PGStore()
  : new InMemoryStore();
