import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Client from "./Client";
import dashboardRoutes from "./Main/Dashboard/dashboard.routes";
import historyRoutes from "./Main/History/history.routes";
import patrolGuardRoutes from "./Main/PatrolGuard/patrol-guard.routes";
import beatsRoutes from "./Main/Beats/beats.routes";
import settingsRoutes from "./Main/Settings/settings.routes";
const {
    dashboard_routes,
    dashboard_routes_empt
} = dashboardRoutes
const {
    history_routes,
    history_routes_empt
} = historyRoutes
const {
    patrol_guard_routes,
    patrol_guard_routes_empt
} = patrolGuardRoutes
const {
    beats_routes,
    beats_routes_empt
} = beatsRoutes
const {
    settings_routes,
    settings_routes_empt
} = settingsRoutes


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
            element: <LoadingSpinner />
        }
    ]
}

export default client_routes;