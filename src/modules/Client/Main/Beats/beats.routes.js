import BeatList from "./BeatList/BeatList";
import Beats from "./Beats";
import AddBeat from "./AddBeat/AddBeat";

const beats_routes = {
    path: "beats",
    element: <Beats />,
    children: [
        {
            path: "",
            element: <BeatList/>
        },
        {
            path: "list",
            element: <BeatList/>
        },
        {
            path: "add",
            element: <AddBeat/>
        }
    ]

}
const beats_routes_empt = {
    path: "",
    element: <Beats />,
    children: [
    ]

}

export default { beats_routes, beats_routes_empt };