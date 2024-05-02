import ClockIn from "./ClockInHistory/ClockInHistory";
import ClockOutHistory from "./ClockOutHistory/ClockOutHistory";
import History from "./History";
import OutOnBreakHistory from "./OutOnBreakHistory/OutOnBreakHistory";
import PatrolsHistory from "./PatrolsHistory/PatrolsHistory";

const history_routes = {
    path: "history",
    element: <History />,
    children: [
        {
            path: "",
            element: <ClockIn/>
        },
        {
            path: "clock-in",
            element: <ClockIn/>
        },
        {
            path: "clock-out",
            element: <ClockOutHistory/>
        },
        {
            path: "out-on-break",
            element: <OutOnBreakHistory/>
        },
        {
            path: "patrols",
            element: <PatrolsHistory/>
        }
    ]

}
const history_routes_empt = {
    path: "",
    element: <History />,
    children: [
    ]

}

export default { history_routes, history_routes_empt };