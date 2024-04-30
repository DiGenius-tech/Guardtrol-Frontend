import { MiddlewareAPI, isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const rtkQueryErrorLogger =
  (api: MiddlewareAPI) => (next: any) => (action: any) => {
    if (isRejectedWithValue(action)) {
      if (action?.payload?.data?.error) {
        toast.error(action?.payload?.data?.error, {});
        return;
      }
      if (action?.payload?.data?.errors) {
        toast.error(action?.payload?.data?.errors[0]?.message, {});
        return;
      } else {
        toast.error(action?.payload?.data?.error, {});
      }
    }
    return next(action);
  };
