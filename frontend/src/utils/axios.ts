import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST || ""}/v1`,
});

export default axiosInstance;
