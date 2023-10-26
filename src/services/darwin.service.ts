import Axios from "axios";
import { base64encode } from "nodejs-base64";
import store from "store";
import { format } from "date-fns";

const getHeaders = (host: string) => ({
  "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Redmi Note 5 MIUI/9.6.27)",
  Host: host,
  Connection: "Keep-Alive",
});

interface ILogin {
  qrcode: string;
  host: string;
}

export const login = async ({ qrcode, host }: ILogin) => {
  const payload = {
    qrcode,
    udid: "",
  };

  const { data } = await Axios.post(`https://${host}/Mobileapi/auth`, payload, {
    headers: getHeaders(host),
  });
  if (data?.token) {
    (globalThis as any).store.setLoginData({ ...data, host });
  }
  return data;
};

interface ICheckin {
  location_type?: number;
  message?: string;
  latlng: string;
  location?: string;
}
export const checkin = async ({
  location_type,
  message,
  latlng,
  location,
}: ICheckin) => {
  if (!location_type || !latlng)
    throw new Error(`location_type and latlng is required!`);

  const loginData = (globalThis as any).store.getLoginData();
  if (!loginData?.token) throw new Error("You are not logged in ");

  const lastCheckInData = await getLastCheckin();
  const currDate = format(new Date(), "yyyy-MM-dd");
  if (
    currDate === lastCheckInData?.message?.date &&
    lastCheckInData?.message?.last_action === 1
  )
    throw new Error("Today you have already checkin before");

  const payload = {
    token: loginData.token,
    location: base64encode(location || latlng),
    latlng,
    message,
    location_type: location_type || 2, // 1 for Office, 2 for Home, 3 for Field Duty
    in_out: 1,
    udid: "",
    purpose: "",
  };

  const { data } = await Axios.post(
    `https://${loginData.host}/Mobileapi/CheckInPost`,
    payload,
    {
      headers: getHeaders(loginData.host),
    }
  );
  return data;
};

export const getLastCheckin = async () => {
  const loginData = (globalThis as any).store.getLoginData();
  if (!loginData?.token) throw new Error("You are not logged in ");
  const { data: lastCheckInData } = await Axios.post(
    `https://${loginData.host}/Mobileapi/LastCheckIndeatils`,
    { token: loginData.token },
    {
      headers: getHeaders(loginData.host),
    }
  );
  return lastCheckInData;
};

export const checkout = async ({
  location_type,
  message,
  latlng,
  location,
}: ICheckin) => {
  if (!location_type || !latlng)
    throw new Error(`location_type and latlng is required!`);

  const loginData = (globalThis as any).store.getLoginData();
  if (!loginData?.token) throw new Error("You are not logged in ");

  const lastCheckInData = await getLastCheckin();
  const currDate = format(new Date(), "yyyy-MM-dd");
  if (
    currDate === lastCheckInData?.message?.date &&
    lastCheckInData?.message?.last_action === 2
  )
    throw new Error("Today you have already checkout before");

  if (!lastCheckInData?.message?.id)
    throw new Error(JSON.stringify(lastCheckInData));

  const payload = {
    checkin_id: lastCheckInData?.message?.id,
    token: loginData.token,
    location: base64encode(location || latlng),
    latlng,
    message,
    location_type: location_type || 2, // 1 for Office, 2 for Home, 3 for Field Duty
    in_out: 2,
    udid: "",
    purpose: "",
  };

  const { data } = await Axios.post(
    `https://${loginData.host}/Mobileapi/CheckInPost`,
    payload,
    {
      headers: getHeaders(loginData.host),
    }
  );

  return data;
};
