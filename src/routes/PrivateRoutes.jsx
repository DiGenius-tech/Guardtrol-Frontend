import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../shared/RouteGuard/PrivateRoute";

const PrivateRouter = () => (
  <Routes>
    <Route>{/* <Route index element={<PrivateRoute />} /> */}</Route>
  </Routes>
);

export { PrivateRouter };
