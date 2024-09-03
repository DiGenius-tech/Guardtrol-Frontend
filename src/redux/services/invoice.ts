import { retry } from "@reduxjs/toolkit/query/react";
import { api } from "./api";
import { TInvoice } from "../../types/invoice";

export const InvoiceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query({
      query: (params) => ({
        url: `invoices`,
        params,
      }),
      providesTags: (result = []) => [
        ...result?.invoices?.map(
          ({ _id }: any) => ({ type: "Invoices", _id } as const)
        ),
        { type: "Invoices" as const, id: "LIST" },
      ],
    }),

    addInvoice: build.mutation<TInvoice, Partial<any>>({
      query(body) {
        return {
          url: `invoices`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Invoices", id: "LIST" }],
    }),
    addInvoices: build.mutation<TInvoice, Partial<any>>({
      query(body) {
        return {
          url: `invoices`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Invoices", id: "LIST" }],
    }),

    updateInvoice: build.mutation<TInvoice, Partial<any>>({
      query(data) {
        return {
          url: `invoices/${data.userid}`,
          method: "PATCH",
          body: data.body,
        };
      },
      invalidatesTags: [{ type: "Invoices", id: "LIST" }],
    }),

    assignGuardToInvoice: build.mutation<TInvoice, Partial<any>>({
      query(data) {
        return {
          url: `invoices/${data.userid}`,
          method: "POST",
          body: data.body,
        };
      },
      invalidatesTags: (invoice) => [{ type: "Invoices", id: invoice?._id }],
    }),

    deleteInvoice: build.mutation<{ success: boolean; _id: number }, any>({
      query(body) {
        return {
          url: `invoices`,
          method: "DELETE",
          body: body,
        };
      },
      invalidatesTags: (invoice) => [{ type: "Invoices", _id: invoice?._id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => "error-prone",
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoicesQuery,
  useUpdateInvoiceMutation,
  useGetErrorProneQuery,
  useAssignGuardToInvoiceMutation,
} = InvoiceApi;
