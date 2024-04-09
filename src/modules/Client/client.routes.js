import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Client from "./Client";
import Activities from "./Main/Dashboard/Activities/Activities";
import Dashboard from "./Main/Dashboard/Dashboard";
import Patrols from "./Main/Dashboard/Patrols/Patrols";

const client_routes = {
    path: "/client",
    element: <Client />,
    children: [
        {
            path: "",
            element: <Dashboard />,
            children: [
                {
                    path: "",
                    element: <Activities />
                },
                {
                    path: "activities",
                    element: <Activities />
                },
                {
                    path: "patrols",
                    element: <Patrols />
                }
            ]
        },
        {
            path: "dashboard",
            element: <Dashboard />,
            children: [
                {
                    path: "",
                    element: <Activities />
                },
                {
                    path: "activities",
                    element: <Activities />
                },
                {
                    path: "patrols",
                    element: <Patrols />
                }
            ]
        },
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        }
    ]
}

export default client_routes;