import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TTimelineLogs } from "../../types/timelineLogs";

export const ShiftApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchTimelineLogs: build.query({
      query: ({
        organizationId,
        startDate,
        endDate,
        type,
        beatId,
        entityType,
        selectedEntity,
        where,
      }) => ({
        url: `logs/${organizationId}`,
        params: {
          startDate,
          endDate,
          type,
          beatId,
          entityType,
          where,
          selectedEntity,
        },
      }),
      providesTags: ["TimelineLogs"],
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
  useFetchTimelineLogsQuery,
  useUpdateShiftMutation,
  useGetErrorProneQuery,
} = ShiftApi;
