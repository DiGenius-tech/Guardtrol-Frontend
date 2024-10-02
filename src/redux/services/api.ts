import { API_BASE_URL } from "../../constants/api";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    } else {
      throw new Error("Authentication token is missing");
    }
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Beats",
    "Subscription",
    "Guards",
    "Users",
    "FaqCategories",
    "Faqs",
    "Tickets",
    "User",
    "TicketReplies",
    "TicketsCategories",
    "Subscriptions",
    "PatrolInstances",
    "UserRole",
    "Roles",
    "Modifications",
    "Invoices",
    "UserSubscriptions",
    "Points",
    "TimelineLogs",
    "OrganizationUsers",
    "Shifts",
    "Patrols",
    "BeatHistory",
    "GuardHistory",
  ],
  endpoints: () => ({}),
});
