import { RootState } from "../store.js";

export const selectSuspense = (state: RootState) => state.suspense;

export const selectSuspenseShow = (state: RootState) =>
  selectSuspense(state).show;
