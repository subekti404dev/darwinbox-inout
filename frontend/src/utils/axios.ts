import Axios from "axios";

export const TOKEN_KEY = "darwin_token";
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) =>
  sessionStorage.setItem(TOKEN_KEY, token);

const axiosInstance = () =>
  Axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST || ""}/v1`,
    headers: {
      ...(!!getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
  });

export default axiosInstance;
