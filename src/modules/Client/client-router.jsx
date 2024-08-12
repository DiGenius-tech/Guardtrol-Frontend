import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Invoice from "../../components/invoice";
import { ReportRouter } from "../Reports/report-router";
import { RequestRouter } from "../Requests/request-router";
import { GuardRouter } from "../Guard/guard-router";
import { BeatsRouter } from "../Beats/beats-router";
import SettingsRouter from "../Settings/settings-router";
import Dashboard from "../Dashboard/Dashboard";
import PageNotFound from "../../PageNotFound/PageNotFound";
import ClientLayout from "./ClientLayout";
import LogOut from "../Auth/pages/LogOut";

const ClientRouter = () => (
  <Routes>
    <Route element={<ClientLayout />}>
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="patrol-guard/*" element={<GuardRouter />} />
      <Route path="beats/*" element={<BeatsRouter />} />
      <Route path="settings/*" element={<SettingsRouter />} />
      <Route path="loading-spinner" element={<LoadingSpinner />} />
      <Route path="reports/*" element={<ReportRouter />} />
      <Route path="requests/*" element={<RequestRouter />} />
      <Route path="logout/*" element={<LogOut />} />
      <Route path="invoice" element={<Invoice />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  </Routes>
);

export default ClientRouter;
