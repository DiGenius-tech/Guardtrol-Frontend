// AuthSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";

interface Auth {
  token: string;
  user:
    | {
        clientid: string;
        email: string;
        image: string;
        name: string;
        onboardingcomplete: true;
        token: string;
        userid: string;
      }
    | undefined;
  isAuthenticated: boolean;
  role: string;
}

const initialState: Auth | null = {
  token: "",
  user: undefined,
  isAuthenticated: false,
  role: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        clientid: string;
        email: string;
        image: string;
        name: string;
        onboardingcomplete: true;
        token: string;
        userid: string;
      }>
    ) {
      state.isAuthenticated = true;

      state.user = action.payload;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = undefined;
      state.token = "";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
