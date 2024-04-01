import AddGuard from "./AddGuard/AddGuard";
import GuardList from "./GuardList/GuardList";
import OnboardGuard from "./OnboardGuard";
import UpdateGuard from "./UpdateGuard/UpdateGuard";

const onboard_guard_routes = {
    path: "onboard-guard",
    element: <OnboardGuard />,
    children: [
        {
            path: "",
            element: <GuardList />
        },
        {
            path: "add-guard",
            element: <AddGuard />
        },
        // {
        //     path: "update-guard/:id",
        //     element: <UpdateGuard />
        // }
    ]
}

export default onboard_guard_routes;