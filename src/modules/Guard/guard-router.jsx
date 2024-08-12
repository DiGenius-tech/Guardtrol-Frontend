import { Navigate, Route, Routes } from "react-router-dom";
import GuardLayout from "./guard-layout";
import ActivePatrolGuards from "./PatrolGuardList/ActivePatrolGuards";
import InactivePatrolGuards from "./PatrolGuardList/InactivePatrolGuards";
import AddGuard from "../Onboarding/OnboardGuard/AddGuard";
import PatrolGuardDetails from "./PatrolGuardDetails";
import ActivateGuard from "./ActivateGuard";
import BulkUploadGuards from "./BulkUploadGuards";

const GuardRouter = () => (
  <Routes>
    <Route element={<GuardLayout />}>
      <Route path="" element={<ActivePatrolGuards />} />
      <Route path="active" element={<ActivePatrolGuards />} />
      <Route path="inactive" element={<InactivePatrolGuards />} />
      <Route path="addguard" element={<AddGuard onBoarding={false} />} />
      <Route path="bulkupload" element={<BulkUploadGuards />} />
      <Route path="details/:guardId" element={<PatrolGuardDetails />} />
      <Route path="activate/:guardId" element={<ActivateGuard />} />
    </Route>
  </Routes>
);

export { GuardRouter };
