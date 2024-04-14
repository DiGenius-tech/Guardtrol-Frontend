import Beats from "./Beats";

const beats_routes = {
    path: "beats",
    element: <Beats />,
    children: [
    ]

}
const beats_routes_empt = {
    path: "",
    element: <Beats />,
    children: [
    ]

}

export default { beats_routes, beats_routes_empt };