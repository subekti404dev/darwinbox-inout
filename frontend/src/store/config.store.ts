/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axiosInstance from "../utils/axios";

interface IHistoryStore {
  config: any;
  user: any;
  loading: boolean;
  error: any;
  fetchData: () => Promise<void>;
}

export const useConfigStore = create<IHistoryStore>((set) => ({
  config: {},
  user: {},
  loading: false,
  error: null,
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/darwin/login-data");
      const config = res?.data?.data || {};
      set({ config, user: config?.user_details, loading: false });
    } catch (error) {
      console.log(error);
      set({ loading: false, error });
    }
  },
}));
