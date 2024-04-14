import Settings from "./Settings";

const settings_routes = {
    path: "settings",
    element: <Settings />,
    children: [
    ]

}
const settings_routes_empt = {
    path: "",
    element: <Settings />,
    children: [
    ]

}

export default { settings_routes, settings_routes_empt };