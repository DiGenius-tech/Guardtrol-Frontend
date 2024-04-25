import { RootState } from "../store.js";

export const selectSubscriptionState = (state: RootState) => state.subscription;

export const selectCurrentSubscription = (state: RootState) =>
  selectSubscriptionState(state).currentSubscription;
