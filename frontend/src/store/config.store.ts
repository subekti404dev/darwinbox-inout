/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axiosInstance from "../utils/axios";

interface IHistoryStore {
  config: any;
  user: any;
  loading: boolean;
  error: any;
  isCheckingToken: boolean;
  isTokenAlive: boolean;
  lastCheckToken: any;
  fetchData: () => Promise<void>;
  checkToken: () => Promise<void>;
}

export const useConfigStore = create<IHistoryStore>((set) => ({
  config: {},
  user: {},
  loading: false,
  error: null,
  isTokenAlive: false,
  isCheckingToken: false,
  lastCheckToken: null,
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
    } catch (error) {
      console.log(error);
      set({ loading: false, error, lastCheckToken: new Date() });
    }
  },
  checkToken: async () => {
    try {
      set({ isCheckingToken: true });
      await axiosInstance.get("/darwin/is-token-alive");
      set({ isCheckingToken: false, isTokenAlive: true });
    } catch (error) {
      console.log(error);
      set({ isCheckingToken: false, isTokenAlive: false });
    }
  },
}));
