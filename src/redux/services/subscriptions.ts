import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TSubscription } from "../../types/subscription";

export const SubscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscription: build.query<TSubscription, void>({
      query: (organization) => ({
        url: `subscriptions/user/active/${organization}`,
      }),
      providesTags: ["Subscription"],
    }),

    getAllSubscriptions: build.query<TSubscription[], void>({
      query: (organization) => ({
        url: `users/getallsubscription/${organization}`,
      }),
      providesTags: ["Subscriptions"],
      transformResponse: (response: any, meta, arg) => response.subscriptions,
    }),

    getAllMySubscriptions: build.query<TSubscription[], void>({
      query: (organization) => ({ url: `subscriptions/${organization}` }),
      providesTags: ["UserSubscriptions"],
    }),

    addSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query: (body) => ({
        url: `subscriptions`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "UserSubscriptions", id: "LIST" }],
    }),

    updateSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query(body) {
        return {
          url: `subscriptions`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (subscription) => [
        { type: "Subscription", id: subscription?._id },
        { type: "Subscriptions", id: subscription?._id },
        { type: "UserSubscriptions", id: subscription?._id },
      ],
    }),

    deleteSubscription: build.mutation<
      { success: boolean; _id: number },
      number
    >({
      query(_id) {
        return {
          url: `deletesubscription/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (subscription) => [
        { type: "Subscription", _id: subscription?._id },
      ],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionQuery,
  useGetAllSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useGetErrorProneQuery,
  useGetAllMySubscriptionsQuery,
} = SubscriptionApi;
