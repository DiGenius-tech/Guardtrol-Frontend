import { Navigate, Route, Routes } from "react-router-dom";
import UsersLayout from "./users-layout";
import { MetricsRouter } from "../Reports/metrics/metrics-router";

const UsersRouter = () => (
  <Routes>
    <Route element={<UsersLayout />}>
      <Route path="" element={<Navigate to={"metrics"} />} />
    </Route>
  </Routes>
);

export { UsersRouter };
