import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TGuard } from "../../types/guad";

export const GuardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGuards: build.query<TGuard[], void>({
      query: () => ({ url: `guard/getguards` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Guards", _id } as const)),
        { type: "Guards" as const, id: "LIST" },
      ],
    }),

    addGuards: build.mutation<TGuard, Partial<any>>({
      query: (body) => {
        return {
          url: `guard/addguards`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [{ type: "Guards", id: "LIST" }],
    }),
    addGuard: build.mutation<TGuard, Partial<any>>({
      query: (body) => {
        return {
          url: `guard/addguard`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [{ type: "Guards", id: "LIST" }],
    }),
    activateGuard: build.mutation<TGuard, Partial<any>>({
      query: (data) => {
        return {
          url: `guard/verify/${data.guardId}`,
          method: "PATCH",
          body: data.statusData,
        };
      },
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
      invalidatesTags: (guard) => [{ type: "Guards", id: guard?._id }],
    }),

    deleteGuard: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `guard/deleteguard/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (guard) => [{ type: "Guards", _id: guard?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGuardsMutation,
  useAddGuardMutation,
  useDeleteGuardMutation,
  useActivateGuardMutation,
  useGetGuardsQuery,
  useUpdateGuardMutation,
  useGetErrorProneQuery,
} = GuardApi;
