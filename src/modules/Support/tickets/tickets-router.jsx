import { Navigate, Route, Routes } from "react-router-dom";
import TicketsLayout from "./tickets-layout";
import SubmitTicketForm from "./create-ticket";
import SupportTickets from "./all-ticket";
import ViewTicket from "./view-ticket";

const TicketsRouter = () => (
  <Routes>
    <Route element={<TicketsLayout />}>
      <Route path="create" element={<SubmitTicketForm />} />
      <Route path="view/:ticketId" element={<ViewTicket />} />
      <Route index element={<SupportTickets />} />
    </Route>
  </Routes>
);

export { TicketsRouter };
