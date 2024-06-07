import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TPoint } from "../../types/point";

export const PointsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPoints: build.query<TPoint[], void>({
      query: () => ({ url: `points` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Points", _id } as const)),
        { type: "Points" as const, id: "LIST" },
      ],
    }),

    createPoints: build.mutation<TPoint, Partial<any>>({
      query: (body) => {
        return {
          url: `points`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [
        { type: "Points", id: "LIST" },
        { type: "TimelineLogs" },
      ],
    }),

    updatePoints: build.mutation<TPoint, Partial<TPoint>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `points/${_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (shift) => [
        { type: "Points", id: shift?._id },
        { type: "TimelineLogs" },
      ],
    }),

    deletePoints: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `points/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (shift) => [
        { type: "Points", _id: shift?._id },
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
  useCreatePointsMutation,
  useDeletePointsMutation,
  useGetPointsQuery,
  useUpdatePointsMutation,
  useGetErrorProneQuery,
} = PointsApi;
