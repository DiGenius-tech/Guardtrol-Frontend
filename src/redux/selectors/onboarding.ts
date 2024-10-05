import { RootState } from "../store.js";

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectOnboardingLevel = (state: RootState) =>
  selectOnboarding(state).onboardingLevel;

export const selectOnboardingGuards = (state: RootState) =>
  selectOnboarding(state).guards;

export const selectPsConfig = (state: RootState) =>
  selectOnboarding(state)?.subscription?.paystack;

export const selectFwConfig = (state: RootState) =>
  selectOnboarding(state)?.subscription?.flutter;

export const selectPlan = (state: RootState) =>
  selectOnboarding(state)?.subscription?.plan;
