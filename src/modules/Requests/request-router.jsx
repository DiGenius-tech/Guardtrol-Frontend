import { Navigate, Route, Routes } from "react-router-dom";
import RequestLayout from "./request-layout";
import { GuardRequestsHistory, RequestsHistory } from "./guard-requests";
import { BeatRequestsHistory } from "./beat-requests";

const RequestRouter = () => (
  <Routes>
    <Route element={<RequestLayout />}>
      <Route path="" element={<Navigate to={"guards"} />} />
      <Route path="guards/*" element={<GuardRequestsHistory />} />
      <Route path="beats/*" element={<BeatRequestsHistory />} />
    </Route>
  </Routes>
);

export { RequestRouter };
