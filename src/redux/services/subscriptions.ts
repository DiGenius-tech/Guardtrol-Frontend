import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TSubscription } from "../../types/subscription";

export const SubscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscription: build.query<TSubscription, any>({
      query: (organization) => ({
        url: `subscriptions/user/active/${organization}`,
      }),
      providesTags: [{ type: "Subscription" }],
    }),

    getAllSubscriptions: build.query<TSubscription[], any>({
      query: (organization) => ({
        url: `users/getallsubscription/${organization}`,
      }),
      providesTags: [{ type: "Subscriptions", id: "LIST" }],
      transformResponse: (response: any) => response.subscriptions,
    }),

    getAllMySubscriptions: build.query<any, any>({
      query: (organization) => ({ url: `subscriptions/${organization}` }),
      providesTags: (result = []) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({
                type: "UserSubscriptions",
                id: _id,
              })),
              { type: "UserSubscriptions", id: "LIST" },
            ]
          : [{ type: "UserSubscriptions", id: "LIST" }],
    }),

    addSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query: ({ organization, body }: any) => ({
        url: `subscriptions/${organization}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "UserSubscriptions", id: "LIST" }],
    }),

    updateSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query: ({ organization, body }: any) => ({
        url: `subscriptions/${organization}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (subscription) => [
        { type: "Subscription", id: subscription?._id },
        { type: "Subscriptions", id: "LIST" },
        { type: "UserSubscriptions", id: "LIST" },
      ],
    }),

    deleteSubscription: build.mutation<
      { success: boolean; _id: number },
      number
    >({
      query: (_id) => ({
        url: `deletesubscription/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Subscriptions", id: "LIST" }],
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
  useGetAllMySubscriptionsQuery,
} = SubscriptionApi;
