import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TUser } from "../../types/user";

export const UserApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<TUser[], void>({
      query: (organizationId) => ({
        url: `organization-users?organization=${organizationId}`,
      }),
      providesTags: (result = []) => [
        ...result.map(
          ({ _id }) => ({ type: "OrganizationUsers", _id } as const)
        ),
        { type: "OrganizationUsers" as const, id: "LIST" },
      ],
    }),

    addUser: build.mutation<TUser, Partial<any>>({
      query(body) {
        return {
          url: `organization-users?organization=${body.organizationId}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "OrganizationUsers", id: "LIST" }],
    }),
    addUsers: build.mutation<TUser, Partial<any>>({
      query(body) {
        return {
          url: `organization-users?organization=${body.organizationId}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "OrganizationUsers", id: "LIST" }],
    }),

    updateUser: build.mutation<TUser, Partial<any>>({
      query(body) {
        return {
          url: `organization-users/${body.organizationId}/${body.id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "OrganizationUsers", id: "LIST" }],
    }),
    deleteUser: build.mutation<{ success: boolean; _id: number }, any>({
      query(body) {
        return {
          url: `organization-users/${body.organizationId}/${body.userToDelete}`,
          method: "DELETE",
          body: body,
        };
      },
      invalidatesTags: (user) => [
        { type: "OrganizationUsers", _id: user?._id },
      ],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetErrorProneQuery,
} = UserApi;
