import { format } from "date-fns";

const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};

const formatTime = (date) => {
  return format(new Date(date), "hh:mm:ss a");
};

// Combined Date and Time
const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export { formatDate, formatTime, formatDateTime };
