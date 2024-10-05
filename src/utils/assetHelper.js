import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export const toAbsoluteUrl = (pathname) => {
  return process.env.PUBLIC_URL + pathname;
};
export const debounceFunc = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useDebouncedValue = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => setDebouncedValue(value), delay);

    handler();
    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
};
