import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Client from "../Client";
import dashboardRoutes from "../Dashboard/dashboard.routes";
import historyRoutes from "../History/history.routes";
import patrolGuardRoutes from "../Guard/patrol-guard.routes";
import beatsRoutes from "../Beats/beats.routes";
import settingsRoutes from "../Settings/settings.routes";
import Receipt from "../../components/invoice";
import Invoice from "../../components/invoice";
import { ReportRouter } from "../Reports/report-router";
import { UsersRouter } from "../Settings/Users/users-router";
import OrganizationUsers from "../Settings/Users/all-users";
import RequestLayout from "../Requests/request-layout";
import { RequestRouter } from "../Requests/request-router";

const { dashboard_routes, dashboard_routes_empt } = dashboardRoutes;
const { history_routes, history_routes_empt } = historyRoutes;
const { patrol_guard_routes, patrol_guard_routes_empt } = patrolGuardRoutes;
const { beats_routes, beats_routes_empt } = beatsRoutes;
const { settings_routes, settings_routes_empt } = settingsRoutes;

const client_routes = {
  path: "/client",
  element: <PrivateRoute component={Client} />,
  children: [
    dashboard_routes_empt,
    dashboard_routes,
    history_routes_empt,
    history_routes,
    patrol_guard_routes,
    patrol_guard_routes_empt,
    beats_routes,
    beats_routes_empt,
    settings_routes,
    settings_routes_empt,
    {
      path: "loading-spinner",
      element: <LoadingSpinner />,
    },
    {
      path: "reports/*",
      element: <ReportRouter />,
    },
    {
      path: "requests/*",
      element: <RequestRouter />,
    },
    {
      path: "invoice",
      element: <Invoice />,
    },
  ],
};

export default client_routes;
