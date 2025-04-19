import { RootState } from "../store.js";

export interface User {
  clientid: string;
  email: string;
  image: string;
  organization: string;
  name: string;
  phone: string;
  emailverified: boolean;
  onboardingcomplete: boolean;
  token: string;
  userid: string;
  currency: string;
}

export const selectAuth = (state: RootState) => state.auth;

export const selectRole = (state: RootState) => selectAuth(state).role;

export const selectOrganization = (state: RootState) =>
  selectAuth(state).organization;

export const selectToken = (state: RootState) => selectAuth(state).token;

export const selectUser = (state: RootState) => selectAuth(state).user;
export const selectSupportUser = (state: RootState) =>
  selectAuth(state).supportUser;

export const selectIsUserLoggedIn = (state: RootState) =>
  selectAuth(state).isAuthenticated;
