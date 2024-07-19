import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { api } from "../redux/services/api";
import { persistor } from "../redux/store";

const useInactivityTimeout = (timeout = 10 * 60 * 1000) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        persistor.purge();
        dispatch(api.util.resetApiState());
        dispatch(logout());
      }, timeout);
    };

    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [dispatch, timeout]);
};

export default useInactivityTimeout;
