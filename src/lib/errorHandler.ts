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

export const errorHandler = <T>(error: AxiosError<ErrorResponse>): any => {
  if (error.response) {
    toast.error(error.response.data.message);
    // The request was made and the server responded with a status code
  } else if (error.request) {
    // The request was made but no response was received
  } else {
    // Something happened in setting up the request that triggered an error
  }
};
