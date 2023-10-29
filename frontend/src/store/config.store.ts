/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { AxiosError } from "axios";

interface IHistoryStore {
  config: any;
  user: any;
  loading: boolean;
  error: any;
  isCheckingToken: boolean;
  isTokenAlive: boolean;
  lastCheckToken: any;
  isLoggingIn: boolean;
  fetchData: () => Promise<void>;
  checkToken: () => Promise<void>;
  doLogin: (qrcode: string) => Promise<void>;
}

export const useConfigStore = create<IHistoryStore>((set, get) => ({
  config: {},
  user: {},
  loading: false,
  error: null,
  isTokenAlive: false,
  isCheckingToken: false,
  lastCheckToken: null,
  isLoggingIn: false,
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/darwin/login-data");
      const config = res?.data?.data || {};
      set({
        config,
        user: config?.user_details,
        loading: false,
        lastCheckToken: new Date(),
      });
      return config;
    } catch (error) {
      console.log(error);
      set({ loading: false, error, lastCheckToken: new Date() });
    }
  },
  checkToken: async () => {
    try {
      if (get().isCheckingToken) return;
      set({ isCheckingToken: true });
      await axiosInstance.get("/darwin/is-token-alive");
      set({ isCheckingToken: false, isTokenAlive: true });
    } catch (error: any) {
      // console.log(error.response);
      if ((error as AxiosError)?.response?.status === 401) {
        set({ isCheckingToken: false, isTokenAlive: false });
      }
    }
  },
  doLogin: async (qrcode) => {
    try {
      set({ isLoggingIn: true });
      await axiosInstance.post("/darwin/login", {
        qrcode,
        host: "efishery.darwinbox.com",
      });
      await get().fetchData();
      await get().checkToken();

      set({ isLoggingIn: false });
    } catch (error) {
      console.log(error);
      set({ isLoggingIn: false });
    }
  },
}));
