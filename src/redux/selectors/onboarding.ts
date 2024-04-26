import { RootState } from "../store.js";

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectOnboardingLevel = (state: RootState) =>
  selectOnboarding(state).onboardingLevel;

export const selectOnboardingGuards = (state: RootState) =>
  selectOnboarding(state).guards;
