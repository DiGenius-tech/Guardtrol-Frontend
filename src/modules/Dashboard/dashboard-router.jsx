import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Dashboard from "./Dashboard";
import Activities from "./Activities/Activities";
import Patrols from "./Patrols";

const DashboardRouter = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute component={Dashboard} />}>
      <Route index element={<Dashboard />} />
      <Route path="activities" element={<Activities />} />
      <Route path="patrols" element={<Patrols />} />
    </Route>
  </Routes>
);

export default DashboardRouter;
