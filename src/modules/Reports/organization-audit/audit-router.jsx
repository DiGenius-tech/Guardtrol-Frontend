import { Navigate, Route, Routes } from "react-router-dom";
import AuditLayout from "./audit-layout";
import { OrganizationAudits } from "./audit";

const AuditRouter = () => (
  <Routes>
    <Route element={<AuditLayout />}>
      <Route path="" element={<Navigate to={"all"} />} />
      <Route path="all" element={<OrganizationAudits />} />
    </Route>
  </Routes>
);

export { AuditRouter };
