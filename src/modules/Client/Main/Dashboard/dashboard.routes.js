import Activities from "./Activities/Activities";
import Dashboard from "./Dashboard";
import Patrols from "./Patrols/Patrols";

const dashboard_routes = {
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

}
const dashboard_routes_empt = {
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

}

export default { dashboard_routes, dashboard_routes_empt };