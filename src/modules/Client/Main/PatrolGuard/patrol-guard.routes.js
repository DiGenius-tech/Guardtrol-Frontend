import ActivateGuard from "./ActivateGuard/ActivateGuard";
import PatrolGuard from "./PatrolGuard";
import PatrolGuardDetails from "./PatrolGuardDetails/PatrolGuardDetails";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";

const patrol_guard_routes = {
    path: "patrol-guard",
    element: <PatrolGuard />,
    children: [
        {
            path: "",
            element: <PatrolGuardList />,
        },
        {
            path: "details/:guardId",
            element: <PatrolGuardDetails />
        },
        {
            path: "activate/:guardId",
            element: <ActivateGuard />
        }
    ]

}
const patrol_guard_routes_empt = {
    path: "",
    element: <PatrolGuard />,
    children: [
    ]

}

export default { patrol_guard_routes, patrol_guard_routes_empt };