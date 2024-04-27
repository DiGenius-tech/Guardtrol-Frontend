import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface ErrorResponse {
  message: string;
}

export interface CustomError {
  message: string;
  status?: number;
  statusText?: string;
}

export const errorHandler = <T>(error: any): any => {
  if (error?.response?.data?.error) {
    return toast.error(error.response.data?.error);
  }
  if (error?.response?.data?.message) {
    return toast.error(error.response.data?.message);
  }
};
