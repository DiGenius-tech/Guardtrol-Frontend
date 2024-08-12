import { Navigate, Route, Routes } from "react-router-dom";
import SupportLayout from "./support-layout";
import { TicketsRouter } from "./tickets/tickets-router";
import { FaqsRouter } from "./faqs/faqs-router";

const SupportRouter = () => (
  <Routes>
    <Route element={<SupportLayout />}>
      <Route path="" element={<Navigate to={"faqs"} />} />
      <Route path="tickets/*" element={<TicketsRouter />} />
      <Route path="faqs/*" element={<FaqsRouter />} />
    </Route>
  </Routes>
);

export { SupportRouter };
