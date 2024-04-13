import PatrolGuard from "./PatrolGuard";

const patrol_guard_routes = {
    path: "patrol-guard",
    element: <PatrolGuard />,
    children: [
    ]

}
const patrol_guard_routes_empt = {
    path: "",
    element: <PatrolGuard />,
    children: [
    ]

}

export default { patrol_guard_routes, patrol_guard_routes_empt };