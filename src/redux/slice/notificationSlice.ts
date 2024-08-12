import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  unreadTickets: string[];
}

const initialState: NotificationState = {
  unreadTickets: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<string>) => {
      state.unreadTickets.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.unreadTickets = state.unreadTickets.filter(
        (ticketId) => ticketId !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.unreadTickets = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
