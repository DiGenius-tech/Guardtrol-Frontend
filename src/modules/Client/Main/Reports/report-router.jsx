import { Navigate, Route, Routes } from "react-router-dom";
import ReportLayout from "./report-layout";
import { HistoryRouter } from "./history/history-router";
import { MetricsRouter } from "./metrics/metrics-router";

const ReportRouter = () => (
  <Routes>
    <Route element={<ReportLayout />}>
      <Route path="" element={<Navigate to={"metrics"} />} />
      <Route path="metrics/*" element={<MetricsRouter />} />
      <Route path="history/*" element={<HistoryRouter />} />
    </Route>
  </Routes>
);

export { ReportRouter };
