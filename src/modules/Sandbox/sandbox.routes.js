import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Sandbox from "./Sandbox";

const sandbox_routes = {
    path: "/sandbox",
    element: <Sandbox />,
    children: [
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        }
    ]
}

export default sandbox_routes;