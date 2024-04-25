// SubscriptionSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";
import { TSubscription } from "../../types/subscription";

interface Subscription {
  isSubscribed: boolean;
  currentSubscription: null | TSubscription;
}

const initialState: Subscription | null = {
  isSubscribed: false,
  currentSubscription: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setCurrentSubscription(state, action) {
      state.currentSubscription = action.payload;
    },
  },
});

export const { setCurrentSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
