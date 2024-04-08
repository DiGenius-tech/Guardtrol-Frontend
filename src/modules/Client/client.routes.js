import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Client from "./Client";
import Dashboard from "./Main/Dashboard/Dashboard";

const client_routes = {
    path: "/client",
    element: <Client />,
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