// SuspenseSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";

interface Suspense {
  show: boolean;
}

const initialState: Suspense | null = {
  show: false,
};

const suspenseSlice = createSlice({
  name: "suspense",
  initialState,
  reducers: {
    suspenseShow(state) {
      state.show = true;
    },
    suspenseHide(state) {
      state.show = false;
    },
  },
});

export const { suspenseShow, suspenseHide } = suspenseSlice.actions;
export default suspenseSlice.reducer;
