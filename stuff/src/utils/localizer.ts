// utils/calendarLocalizer.ts
import { DateLocalizer, momentLocalizer } from "react-big-calendar";
import moment from "moment";

export const localizer: DateLocalizer = momentLocalizer(moment);
