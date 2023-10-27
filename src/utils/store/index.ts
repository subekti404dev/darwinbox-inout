import { PGStore } from "./postgres";
import { InMemoryStore } from "./memory";

export const storeData = process.env.POSTGRES_URL
  ? new PGStore()
  : new InMemoryStore();
