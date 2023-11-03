/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { authToken } from "../utils/token";

interface IFlags {
  use_password: boolean;
}
interface IFlagsStore {
  flags: IFlags;
  isFetching: boolean;
  fetched: boolean;
  showPassModal: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  fetch: () => Promise<void>;
  verifyPass: (pass: string) => Promise<void>;
}

export const useFlagsStore = create<IFlagsStore>((set, get) => ({
  flags: {
    use_password: false,
  },
  isFetching: true,
  fetched: false,
  showPassModal: false,
  isVerifying: false,
  isVerified: false,
  fetch: async () => {
    try {
      if (get().fetched) {
        return get().flags;
      }
      set({ isFetching: true });
      const res = await axiosInstance().get("/flags");
      const flags = res?.data?.data || {};

      set({
        flags,
        isFetching: false,
        fetched: true,
        ...(!authToken.getToken() &&
          flags.use_password && { showPassModal: true }),
      });
      return flags;
    } catch (error) {
      console.log(error);
      set({ isFetching: false });
    }
  },
  verifyPass: async (password: string) => {
    try {
      console.log({ password });

      set({ isVerifying: true });

      const res = await axiosInstance().post("/auth/verify", { password });
      const token = res?.data?.data?.token;
      authToken.setToken(token);
      set({ isVerifying: false, showPassModal: false, isVerified: true });
    } catch (error) {
      console.log(error);
      set({ isVerifying: false });
    }
  },
}));
