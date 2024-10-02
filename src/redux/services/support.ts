import { api } from "./api";

export const supportApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFaqCategories: build.query({
      query: () => "faqs-categories",
      providesTags: ["FaqCategories"],
    }),
    getFaqs: build.query({
      query: (categoryId) => `faqs`,
      providesTags: ["Faqs"],
    }),
    getTickets: build.query({
      query: ({ organization, ...params }) => ({
        url: `tickets/${organization}`,
        params,
      }),
      providesTags: ["Tickets"],
    }),
    getTicketsByID: build.query({
      query: (ticketId) => ({
        url: `tickets/ticket/${ticketId}`,
      }),
      providesTags: (result, error, ticketId) => [
        { type: "Tickets", _id: ticketId },
      ],
    }),
    addTicket: build.mutation({
      query: ({ organization, data }) => ({
        url: `tickets/${organization}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tickets"],
    }),
    getTicketsCategories: build.query({
      query: () => "ticket-categories",
      providesTags: ["TicketsCategories"],
    }),
    getTicketReplies: build.query({
      query: (ticketId) => `tickets/${ticketId}/replies`,
      providesTags: ["TicketReplies"],
    }),
    addTicketReply: build.mutation({
      query: (reply: any) => ({
        url: `ticket-responses`,
        method: "POST",
        body: reply,
      }),
      invalidatesTags: ["TicketReplies"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFaqCategoriesQuery,
  useGetFaqsQuery,
  useGetTicketsQuery,
  useAddTicketMutation,
  useGetTicketsCategoriesQuery,
  useGetTicketRepliesQuery,
  useAddTicketReplyMutation,
  useGetTicketsByIDQuery,
} = supportApi;
