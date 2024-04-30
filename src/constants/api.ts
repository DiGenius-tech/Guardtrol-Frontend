export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/"
    : process.env.VITE_APP_API_URL;
