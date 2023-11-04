import { format } from "date-fns";
import { id } from "date-fns/locale";

export const currentDayName = () => format(new Date(), "EEEE", { locale: id });
export const currentDate = () => format(new Date(), "yyyy-MM-dd");
// console.log({ currentDayName, currentDate });
