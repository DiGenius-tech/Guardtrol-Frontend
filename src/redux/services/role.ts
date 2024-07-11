import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TRole } from "../../types/role";

export const RoleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<TRole[], void>({
      query: (organizationId) => ({ url: `roles/${organizationId}` }),
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Roles", _id } as const)),
        { type: "Roles" as const, id: "LIST" },
      ],
    }),
    getUserOrganizationRole: build.query<TRole[], void>({
      query: (organizationId) => ({ url: `roles/user-role/${organizationId}` }),
      providesTags: ["UserRole"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetRolesQuery, useGetUserOrganizationRoleQuery } = RoleApi;
