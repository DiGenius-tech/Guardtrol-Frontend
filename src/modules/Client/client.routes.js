import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Client from "./Client";

const client_routes = {
    path: "/client",
    element: <Client />,
    children: [
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        }
    ]
}

export default client_routes;