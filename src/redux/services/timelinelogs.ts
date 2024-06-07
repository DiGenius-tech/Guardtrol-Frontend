import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TTimelineLogs } from "../../types/timelineLogs";

export const ShiftApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTimelineLogs: build.query<TTimelineLogs[], void>({
      query: () => ({ url: `logs` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "TimelineLogs", _id } as const)),
        { type: "TimelineLogs" as const, id: "LIST" },
      ],
    }),

    createTimelineLogs: build.mutation<TTimelineLogs, Partial<any>>({
      query: (body) => {
        return {
          url: `logs`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [{ type: "TimelineLogs", id: "LIST" }],
    }),

    updateShift: build.mutation<TTimelineLogs, Partial<TTimelineLogs>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `logs/${_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (shift) => [{ type: "TimelineLogs", id: shift?._id }],
    }),

    deleteShift: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `logs/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (shift) => [{ type: "TimelineLogs", _id: shift?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateTimelineLogsMutation,
  useDeleteShiftMutation,
  useGetTimelineLogsQuery,
  useUpdateShiftMutation,
  useGetErrorProneQuery,
} = ShiftApi;
