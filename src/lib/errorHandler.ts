import { AxiosError } from "axios";

export interface ErrorResponse {
  message: string;
}

export interface CustomError {
  message: string;
  status?: number;
  statusText?: string;
}

export const errorHandler = <T>(
  error: AxiosError<ErrorResponse>
): Promise<T> => {
  if (error.response) {
    // The request was made and the server responded with a status code
    return Promise.reject<T>(error.response.data.message as unknown as T);
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject<T>("No response from server" as unknown as T);
  } else {
    // Something happened in setting up the request that triggered an error
    return Promise.reject<T>("An unexpected error occurred" as unknown as T);
  }
};
