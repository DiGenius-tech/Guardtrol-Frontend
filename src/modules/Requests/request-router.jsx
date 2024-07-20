import { Navigate, Route, Routes } from "react-router-dom";
import RequestLayout from "./request-layout";
import { RequestsHistory } from "./requests";

const RequestRouter = () => (
  <Routes>
    <Route element={<RequestLayout />}>
      <Route path="" element={<Navigate to={"all"} />} />
      <Route path="all/*" element={<RequestsHistory />} />
    </Route>
  </Routes>
);

export { RequestRouter };
