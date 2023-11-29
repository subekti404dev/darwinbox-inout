import Axios from "axios";
import { storeData } from "../utils/store";

type ISendMessage = {
  message: string;
};

export const sendMessage = async ({ message }: ISendMessage) => {
  const cfg = storeData.getConfigData() || {};
  const telegramBot = cfg.telegramBot || {};
  const { enabled, token, chatId } = telegramBot;
  if (enabled && !!token && !!chatId) {
    await Axios.post(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=markdown`
    );
  }
};

type INotifyMe = {
  type: "checkin" | "checkout";
  status: "success" | "failed";
  data: string;
};

export const notifyMe = async ({ type, status, data }: INotifyMe) => {
  try {
    const cfg = storeData.getConfigData() || {};
    const name = (cfg.user_details?.name || "").split(" ").reverse()?.[0];
    let message = `*Hello, ${name}*%0A`;
    message += `Your darwinbox ${type} was _${status.toUpperCase()}_ :%0A%0A`;
    message += "```" + data + "```";
    await sendMessage({ message });
  } catch (error: any) {
    const errMsg = error?.response?.data || error?.message;
    console.log("failed to notify:", errMsg);
  }
};
