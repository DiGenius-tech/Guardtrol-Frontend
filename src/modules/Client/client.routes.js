import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Client from "./Client";
import Dashboard from "./Main/Dashboard/Dashboard";

const client_routes = {
    path: "/client",
    element: <PrivateRoute component={Client} />,
    children: [
        {
            path: "",
            element: <Dashboard />
        },
        {
            path: "dashboard",
            element: <Dashboard />
        },
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        }
    ]
}

export default client_routes;