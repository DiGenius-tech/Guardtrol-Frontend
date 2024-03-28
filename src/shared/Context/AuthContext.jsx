import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  isloading: false,
  user: [null],
  token: null,
  login: () => {},
  loading: () => {},
  logout: () => {},
  
})