import { InMemoryStore } from "./memory";

const defaultConfig = {
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
  scheduler: false,
  holidays: [],
  delay: 0,
  randomizeDelay: false,
  randomizeLocation: false,
  locations: [],
  telegramBot: {
    enabled: false,
    token: "",
    chatId: "",
  },
};

export const storeData = new InMemoryStore(defaultConfig);
