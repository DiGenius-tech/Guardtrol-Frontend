import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TBeat } from "../../types/beat";

export const BeatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBeats: build.query<TBeat[], void>({
      query: (userid) => ({ url: `beat/getbeats/${userid}` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Beats", _id } as const)),
        { type: "Beats" as const, id: "LIST" },
      ],
      transformResponse: (response: any, meta, arg) => response.beats,
    }),

    addBeat: build.mutation<TBeat, Partial<TBeat>>({
      query: (body) => ({
        url: `beat/addbeat`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Beats", id: "LIST" }],
    }),

    updateBeat: build.mutation<TBeat, Partial<TBeat>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `editbeat/${_id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (student) => [{ type: "Beats", id: student?._id }],
    }),
    assignGuardToBeat: build.mutation<TBeat, Partial<any>>({
      query(data) {
        return {
          url: `guard/assignbeat/${data.userid}`,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: (student) => [{ type: "Beats", id: student?._id }],
    }),

    deleteBeat: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `deletebeat/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (student) => [{ type: "Beats", _id: student?._id }],
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
