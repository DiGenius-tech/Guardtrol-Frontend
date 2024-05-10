import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TShift } from "../../types/shift";

export const ShiftApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShifts: build.query<TShift[], void>({
      query: () => ({ url: `shifts` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Shifts", _id } as const)),
        { type: "Shifts" as const, id: "LIST" },
      ],
    }),

    createShifts: build.mutation<TShift, Partial<any>>({
      query: (body) => {
        return {
          url: `shifts`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [{ type: "Shifts", id: "LIST" }],
    }),

    updateShift: build.mutation<TShift, Partial<TShift>>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `shifts/${_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (shift) => [{ type: "Shifts", id: shift?._id }],
    }),

    deleteShift: build.mutation<{ success: boolean; _id: number }, number>({
      query(_id) {
        return {
          url: `shifts/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (shift) => [{ type: "Shifts", _id: shift?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateShiftsMutation,
  useDeleteShiftMutation,
  useGetShiftsQuery,
  useUpdateShiftMutation,
  useGetErrorProneQuery,
} = ShiftApi;
