import { PGStore } from "./postgres";
import { InMemoryStore } from "./memory";

const defaultLocation = {
  in: {
    type: 2,
    location: "Starbucks",
    latlng: "-6.9267329,107.6365366",
    message: "",
  },
  out: {
    type: 2,
    location: "Starbucks",
    latlng: "-6.9267329,107.6365366",
    message: "",
  },
};

export const storeData = process.env.POSTGRES_URL
  ? new PGStore(defaultLocation)
  : new InMemoryStore(defaultLocation);
