import { useEffect, useState } from "react";
import Axios from "axios";

const axios = Axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST || ""}/v1`,
});

const useLoginData = () => {
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      const res = await axios.get("/darwin/login-data");
      setData(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    fetchData,
    data,
  };
};

export default useLoginData;
