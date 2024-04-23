import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../constants/api";
import { errorHandler } from "./errorHandler";
import { error } from "console";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = async <T>(
  url: string,
  token?: string
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};

export const post = async <T>(
  url: string,
  data?: any,
  token?: string,
  isPrompt?: boolean,
  prompt?: string
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });

    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};

export const put = async <T>(
  url: string,
  data?: any,
  token?: string,
  isPrompt?: boolean,
  prompt?: string
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, data, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};

export const del = async <T>(
  url: string,
  token?: string,
  isPrompt?: boolean,
  prompt?: string
): Promise<T | undefined> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url, {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });
    return response.data;
  } catch (error: any) {
    errorHandler(error);
  }
};
