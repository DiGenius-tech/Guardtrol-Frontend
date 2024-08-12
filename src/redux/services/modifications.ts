import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const modificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllModifications: builder.query<any, any>({
      query: ({ organization, type }) => ({
        url: `modifications/all/${organization}`,
        params: { type },
      }),
      providesTags: (result = []) => [
        ...result.map(
          ({ _id }: any) => ({ type: "Modifications", _id } as const)
        ),
        { type: "Modifications" as const, id: "LIST" },
      ],
    }),
    approveModification: builder.mutation({
      query: (modificationId) => ({
        url: `modifications/approve/${modificationId}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Modifications" as const, id: "LIST" }],
    }),
    revertModification: builder.mutation({
      query: (modificationId) => ({
        url: `modifications/revert/${modificationId}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Modifications" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useApproveModificationMutation,
  useRevertModificationMutation,
  useGetAllModificationsQuery,
} = modificationsApi;
