import { Navigate, Route, Routes } from "react-router-dom";
import FaqsLayout from "./faqs-layout";
import Faqs from "./all-faqs";

const FaqsRouter = () => (
  <Routes>
    <Route element={<FaqsLayout />}>
      <Route path="" element={<Navigate to={"all"} />} />
      <Route path="all" element={<Faqs />} />
    </Route>
  </Routes>
);

export { FaqsRouter };
