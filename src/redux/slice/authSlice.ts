// AuthSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";
import { PURGE } from "redux-persist";
import { createEntityAdapter } from "@reduxjs/toolkit";

interface Auth {
  token: string | null;
  user:
    | {
        clientid: string;
        email: string;
        image: string;
        organization: string;
        name: string;
        phone: string;
        emailverified: boolean;
        onboardingcomplete: true;
        token: string;
        userid: string;
      }
    | undefined;
  isAuthenticated: boolean;
  role: string;
}

const initialState: Auth = {
  token: null,
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
        organization: string;
        phone: string;
        emailverified: boolean;
        onboardingcomplete: true;
        token: string;
        userid: string;
      }>
    ) {
      state.isAuthenticated = true;
      console.log(action.payload);
      state.user = action.payload;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = undefined;
      state.token = null;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
