import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TBeat } from "../../types/beat";
import { buildCreateSlice } from "@reduxjs/toolkit";

export const BeatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBeats: build.query({
      query: ({ organization, page = 1, limit = 10 }: any) => ({
        url: `beat/getbeats/${organization}`,
        params: { page, limit },
      }),
      transformResponse: (response: any) => ({
        beats: response.beats,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalBeats: response.totalBeats,
      }),
    }),

    addBeat: build.mutation<TBeat, Partial<any>>({
      query({ organization, beat }) {
        return {
          url: `beat/addbeat/${organization}`,
          method: "POST",
          body: beat,
        };
      },
      invalidatesTags: [{ type: "Beats", id: "LIST" }],
    }),
    addBeats: build.mutation<TBeat, Partial<any>>({
      query({ organization, beats }) {
        return {
          url: `beat/addbeat/${organization}`,
          method: "POST",
          body: beats,
        };
      },
      invalidatesTags: [{ type: "Beats", id: "LIST" }],
    }),

    updateBeat: build.mutation<TBeat, Partial<any>>({
      query(data) {
        return {
          url: `beat/editbeat/${data.userid}`,
          method: "PATCH",
          body: data.body,
        };
      },
      invalidatesTags: [
        { type: "Beats", id: "LIST" },
        { type: "TimelineLogs" },
      ],
    }),

    assignGuardToBeat: build.mutation<TBeat, Partial<any>>({
      query(data) {
        return {
          url: `guard/assignbeat`,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: (beat) => [
        { type: "Beats", id: beat?._id },
        { type: "TimelineLogs" },
      ],
    }),
    unAssignFromGuardToBeat: build.mutation<TBeat, Partial<any>>({
      query(data) {
        return {
          url: `guard/unassignguard`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (beat) => [
        { type: "Beats", id: beat?._id },
        { type: "TimelineLogs" },
      ],
    }),

    deleteBeat: build.mutation<{ success: boolean; _id: number }, any>({
      query(body) {
        return {
          url: `beat/deletebeat`,
          method: "DELETE",
          body: body,
        };
      },
      invalidatesTags: (beat) => [
        { type: "Beats", _id: beat?._id },
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
  useUnAssignFromGuardToBeatMutation,
  useAddBeatMutation,
  useDeleteBeatMutation,
  useGetBeatsQuery,
  useUpdateBeatMutation,
  useGetErrorProneQuery,
  useAssignGuardToBeatMutation,
} = BeatApi;
