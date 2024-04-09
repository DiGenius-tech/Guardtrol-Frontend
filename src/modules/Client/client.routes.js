import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Client from "./Client";
import dashboardRoutes from "./Main/Dashboard/dashboard.routes";
import historyRoutes from "./Main/History/history.routes";
const {
    dashboard_routes,
    dashboard_routes_empt
} = dashboardRoutes
const {
    history_routes,
    history_routes_empt
} = historyRoutes


const client_routes = {
    path: "/client",
    element: <Client />,
    children: [
        dashboard_routes_empt,
        dashboard_routes,
        history_routes_empt,
        history_routes,
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        }
    ]
}

export default client_routes;