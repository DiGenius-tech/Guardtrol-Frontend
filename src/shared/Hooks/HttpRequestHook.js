import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";
import { API_BASE_URL } from "../../constants/api";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import axios from "axios";

const useHttpRequest = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const sendRequest = async (
    url,
    method = "GET",
    body = null,
    headers = {},
    base = true
  ) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);
    try {
      const { data } = await axios(base ? API_BASE_URL + url : url, {
        method,
        body: body ? body : null,
        headers: {
          ...headers,
        },
        mode: "cors",
      });
      console.log(data);
      if (!data) {
        return setError(data.message || "Something went wrong!");
      }

      setIsLoading(false);
      setResponseData(data);

      return data;
    } catch (err) {
      console.log(err);
      if (
        err?.response?.data?.message ==
          "Authentication Error TokenExpiredError: jwt expired" ||
        err?.response?.data?.message ===
          "Authentication Error JsonWebTokenError: invalid signature"
      ) {
        persistor.purge();
        api.util.resetApiState();
      }
      return setError(err.message || "Something went wrong!");
    } finally {
      auth.loading(false);
    }
  };

  return { isLoading, error, responseData, sendRequest };
};

export default useHttpRequest;
