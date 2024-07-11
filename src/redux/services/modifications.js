import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const modificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllModifications: builder.query({
      query: () => "modifications/all",
    }),
    getModifications: builder.query({
      query: () => "modifications/pending",
    }),
    approveModification: builder.mutation({
      query: (modificationId) => ({
        url: `modifications/approve/${modificationId}`,
        method: "PATCH",
      }),
    }),
    revertModification: builder.mutation({
      query: (modificationId) => ({
        url: `modifications/revert/${modificationId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetModificationsQuery,
  useApproveModificationMutation,
  useRevertModificationMutation,
  useGetAllModificationsQuery,
} = modificationsApi;
