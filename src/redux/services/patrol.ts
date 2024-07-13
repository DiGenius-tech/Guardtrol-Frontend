import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TPatrol } from "../../types/patrol";

export const PatrolsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPatrols: build.query<TPatrol[], void>({
      query: () => ({ url: `patrols` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Patrols", _id } as const)),
        { type: "Patrols" as const, id: "LIST" },
      ],
    }),
    fetchPatrolInstances: build.query({
      query: ({
        organizationId,
        startDate,
        endDate,
        guardName,
        beatId,
        page,
        limit,
      }) => ({
        url: `patrols/get-instances/${organizationId}`,
        params: { startDate, endDate, guardName, beatId, page, limit },
      }),
      providesTags: (result) => [
        ...result.patrols.map(({ _id }: any) => ({
          type: "PatrolInstances",
          _id,
        })),
        { type: "PatrolInstances", id: "LIST" },
      ],
    }),

    createPatrol: build.mutation<TPatrol, Partial<any>>({
      query: (body) => {
        return {
          url: `patrols`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [
        { type: "Patrols", id: "LIST" },
        { type: "TimelineLogs" },
      ],
    }),

    updatePatrols: build.mutation<TPatrol, Partial<TPatrol>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `patrols/${_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (shift) => [
        { type: "Patrols", id: shift?._id },
        { type: "TimelineLogs" },
      ],
    }),

    deletePatrols: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `patrols/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (shift) => [
        { type: "Patrols", _id: shift?._id },
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
  useCreatePatrolMutation,
  useDeletePatrolsMutation,
  useGetPatrolsQuery,
  useUpdatePatrolsMutation,
  useGetErrorProneQuery,
  useFetchPatrolInstancesQuery,
} = PatrolsApi;
