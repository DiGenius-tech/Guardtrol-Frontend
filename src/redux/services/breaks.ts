import { api } from "./api";
import { TBreak } from "../../types/break";

export const BreaksApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBreaks: build.query<{ breaks: TBreak[], totalPages: number, currentPage: number }, any>({
      query: ({ beatId, page, limit }) => ({
        url: `breaks/${beatId}`,
        params: { page, limit },
      }),
      providesTags: (result) => {
        return result
          ? [
              ...result.breaks.map(({ _id }) => ({ type: 'Breaks' as const, id: _id })),
              { type: 'Breaks' as const, id: 'LIST' },
            ]
          : [{ type: 'Breaks' as const, id: 'LIST' }];
      },
    }),

    createBreak: build.mutation<TBreak, Partial<any>>({
      query: (body) => {
        return {
          url: `breaks`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: [{ type: 'Breaks' as const, id: 'LIST' }],
    }),

    deleteBreak: build.mutation<{ success: boolean; _id: string }, string>({
      query(breakId) {
        return {
          url: `breaks/${breakId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Breaks' as const, id: 'LIST' },
        { type: 'Breaks' as const, id }
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBreaksQuery,
  useCreateBreakMutation,
  useDeleteBreakMutation,
} = BreaksApi;