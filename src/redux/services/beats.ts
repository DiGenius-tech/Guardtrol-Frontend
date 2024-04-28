import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TBeat } from "../../types/beat";

export const BeatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBeats: build.query<TBeat[], void>({
      query: () => ({ url: `beat/getbeats` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Beats", _id } as const)),
        { type: "Beats" as const, id: "LIST" },
      ],
      transformResponse: (response: any, meta, arg) => response.beats,
    }),

    addBeat: build.mutation<TBeat, Partial<any>>({
      query(body) {
        return {
          url: `beat/addbeat`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Beats", id: "LIST" }],
    }),
    addBeats: build.mutation<TBeat, Partial<any>>({
      query(body) {
        return {
          url: `beat/addbeat`,
          method: "POST",
          body,
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
      invalidatesTags: [{ type: "Beats", id: "LIST" }],
    }),

    assignGuardToBeat: build.mutation<TBeat, Partial<any>>({
      query(data) {
        return {
          url: `guard/assignbeat/${data.userid}`,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: (beat) => [{ type: "Beats", id: beat?._id }],
    }),

    deleteBeat: build.mutation<{ success: boolean; _id: number }, any>({
      query(body) {
        return {
          url: `beat/deletebeat`,
          method: "DELETE",
          body: body,
        };
      },
      invalidatesTags: (beat) => [{ type: "Beats", _id: beat?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddBeatMutation,
  useDeleteBeatMutation,
  useGetBeatsQuery,
  useUpdateBeatMutation,
  useGetErrorProneQuery,
  useAssignGuardToBeatMutation,
} = BeatApi;
