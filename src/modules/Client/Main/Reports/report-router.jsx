import { Navigate, Route, Routes } from "react-router-dom";
import { HistoryRouter } from "./history/history-router";
import { MetricsRouter } from "./metrics/metrics-router";
import { LogRouter } from "./log/log-router";
import ReportLayout from "./report-layout";

const ReportRouter = () => (
  <Routes>
    <Route element={<ReportLayout />}>
      <Route path="" element={<Navigate to={"metrics"} />} />
      <Route path="metrics/*" element={<MetricsRouter />} />
      <Route path="history/*" element={<HistoryRouter />} />
      <Route path="log/*" element={<LogRouter />} />
    </Route>
  </Routes>
);

export { ReportRouter };
