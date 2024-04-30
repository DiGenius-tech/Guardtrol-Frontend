// SuspenseSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";
import { PURGE } from "redux-persist";

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
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { suspenseShow, suspenseHide } = suspenseSlice.actions;
export default suspenseSlice.reducer;
