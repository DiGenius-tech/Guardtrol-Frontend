import { RootState } from "../store.js";

export const selectNotification = (state: RootState) => state.notification;

export const selectUnreadTickets = (state: RootState) =>
  selectNotification(state).unreadTickets;
