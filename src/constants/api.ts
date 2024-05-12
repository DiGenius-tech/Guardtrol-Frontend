export const API_BASE_URL =
  process.env.REACT_APP_NODE_ENV === "development"
    ? "http://localhost:5000/api/"
    : `${process.env.REACT_APP_VITE_APP_API_URL}api/`; 

export const ASSET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : process.env.REACT_APP_VITE_APP_API_URL;
