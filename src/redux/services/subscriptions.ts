import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TSubscription } from "../../types/subscription";

export const SubscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscription: build.query<TSubscription[], void>({
      query: (userID: any) => ({ url: `users/getsubscription/${userID}` }),
      providesTags: ["Subscription"],
    }),

    addSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query: (body) => ({
        url: `subscription/addsubscription`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),

    updateSubscription: build.mutation<TSubscription, Partial<TSubscription>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `editsubscription/${_id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (student) => [
        { type: "Subscription", id: student?._id },
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
      invalidatesTags: (student) => [
        { type: "Subscription", _id: student?._id },
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
  useUpdateSubscriptionMutation,
  useGetErrorProneQuery,
} = SubscriptionApi;
