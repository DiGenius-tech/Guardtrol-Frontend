import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TGuard } from "../../types/guad";

export const GuardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGuards: build.query<TGuard[], any>({
      query: ({ organization, searchQuery }) => ({
        url: `guard/getguards/${organization}`,
        params: { searchQuery },
      }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Guards", _id } as const)),
        { type: "Guards" as const, id: "LIST" },
      ],
    }),

    addGuards: build.mutation<TGuard, Partial<any>>({
      query: (body) => {
        return {
          url: `guard/addguards/${body.organization}`,
          method: "POST",
          body: { guards: body.guards },
        };
      },
      invalidatesTags: [
        { type: "Guards", id: "LIST" },
        { type: "TimelineLogs" },
      ],
    }),
    addGuard: build.mutation<TGuard, Partial<any>>({
      query: (body) => {
        return {
          url: `guard/addguard/${body.organization}`,
          method: "POST",
          body: { guard: body.guard },
        };
      },
      invalidatesTags: [
        { type: "Guards", id: "LIST" },
        { type: "TimelineLogs" },
      ],
    }),
    activateGuard: build.mutation<TGuard, Partial<any>>({
      query: (data) => {
        return {
          url: `guard/verify/${data.guardId}`,
          method: "PATCH",
          body: data.statusData,
        };
      },
      invalidatesTags: [
        { type: "Guards", id: "LIST" },
        { type: "TimelineLogs" },
      ],
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
      invalidatesTags: (guard) => [
        { type: "Guards", id: guard?._id },
        { type: "TimelineLogs" },
      ],
    }),

    deleteGuard: build.mutation<{ success: boolean; _id: number }, TGuard>({
      query(body) {
        return {
          url: `guard/deleteguard/${body?._id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (guard) => [
        { type: "Guards", _id: guard?._id },
        { type: "TimelineLogs" },
      ],
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
