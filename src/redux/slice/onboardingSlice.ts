// SubscriptionSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";
import { TSubscription } from "../../types/subscription";
import { PURGE } from "redux-persist";

interface Subscription {
  onboardingLevel: number | null;
  guards: any;
}

const initialState: Subscription | null = {
  onboardingLevel: null,
  guards: [],
};

const onboardingSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setOnboardingLevel(state, action) {
      state.onboardingLevel = action.payload;
    },
    setOnboardingGuards(state, action) {
      console.log(action.payload);
      state.guards = action.payload;
    },
    addOnboardingGuard(state, action) {
      state.guards = [...state.guards, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { setOnboardingLevel, addOnboardingGuard, setOnboardingGuards } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
