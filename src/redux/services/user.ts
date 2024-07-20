import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TUser } from "../../types/user";

export const RoleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<TUser[], void>({
      query: (userid) => ({ url: `users/getuser/${userid}` }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserQuery } = RoleApi;
