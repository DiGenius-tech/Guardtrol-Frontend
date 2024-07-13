import { api } from "./api";

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchBeatHistory: build.query<
      any,
      {
        organizationId: string;
        page?: number;
        limit?: number;
        beatId?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({
        organizationId,
        page = 1,
        limit = 10,
        beatId,
        startDate,
        endDate,
      }) => ({
        url: `reports/beat-history/${organizationId}`,
        params: { page, limit, beatId, startDate, endDate },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.patrols.map(({ beatName }: any) => ({
                type: "BeatHistory",
                id: beatName,
              })),
              { type: "BeatHistory", id: "LIST" },
            ]
          : [{ type: "BeatHistory", id: "LIST" }],
    }),

    fetchGuardHistory: build.query({
      query: ({
        organizationId,
        page,
        limit,
        startDate,
        endDate,
        searchQuery,
      }) => ({
        url: `reports/guard-history/${organizationId}`,
        params: { page, limit, startDate, endDate, searchQuery },
      }),

      providesTags: ["GuardHistory"],
    }),
  }),

  overrideExisting: true,
});

export const { useFetchBeatHistoryQuery, useFetchGuardHistoryQuery } =
  reportsApi;
