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

const formatCurrency = (amount) => {
  const roundedAmount = Math.round(amount);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(roundedAmount);
};

function formatToNairaRounded(amount) {
  const roundedAmount = Math.round(amount);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(roundedAmount);
}
export { formatDate, formatTime, formatDateTime, formatCurrency };
