export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/"
    : process.env.LIVE_APP_API_URL;

export const ASSET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : process.env.LIVE_APP_API_URL;
