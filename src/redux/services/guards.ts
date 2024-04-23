import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TGuard } from "../../types/guad";

export const GuardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGuards: build.query<TGuard[], void>({
      query: (userid) => ({ url: `guard/getguards/${userid}` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Guards", _id } as const)),
        { type: "Guards" as const, id: "LIST" },
      ],
    }),

    addGuard: build.mutation<TGuard, Partial<TGuard>>({
      query: (body) => ({
        url: `guard/addguard`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Guards", id: "LIST" }],
    }),

    updateGuard: build.mutation<TGuard, Partial<TGuard>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `guard/editguard/${_id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (student) => [{ type: "Guards", id: student?._id }],
    }),

    deleteGuard: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `guard/deleteguard/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (student) => [{ type: "Guards", _id: student?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGuardMutation,
  useDeleteGuardMutation,
  useGetGuardsQuery,
  useUpdateGuardMutation,
  useGetErrorProneQuery,
} = GuardApi;
