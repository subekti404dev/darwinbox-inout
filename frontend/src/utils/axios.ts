import { createStandaloneToast } from "@chakra-ui/react";
import Axios from "axios";

export const TOKEN_KEY = "darwin_token";
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) =>
  sessionStorage.setItem(TOKEN_KEY, token);

const toast = createStandaloneToast();
const axiosInstance = () =>
  Axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST || ""}/v1`,
    headers: {
      ...(!!getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
  }).interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      let errMsg = err?.response?.data?.message;
      if (!errMsg && err?.response?.data) {
        try {
          errMsg = JSON.stringify(err?.response?.data);
        } catch (error) {
          console.log(error);
        }
      }
      if (!errMsg) errMsg = err.message;
      toast.toast({ title: errMsg, status: 'error' });
      return Promise.reject(err);
    }
  );

export default axiosInstance;
