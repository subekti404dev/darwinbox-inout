/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axiosInstance from "../utils/axios";

interface IHistory {
  date: string;
  location_type: number;
  location: string;
  latlng: string;
  message: string;
  type: string;
  status: number;
  errMsg?: string | null;
}

interface IHistoryStore {
  histories: IHistory[];
  loading: boolean;
  error: any;
  fetchData: () => Promise<void>;
}

export const useHistoryStore = create<IHistoryStore>((set) => ({
  histories: [],
  loading: false,
  error: null,
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance().get("/darwin/histories");
      set({ histories: res?.data?.data || [], loading: false });
    } catch (error) {
      console.log(error);
      set({ loading: false, error });
    }
  },
}));
