import AddGuard from "./AddGuard/AddGuard";
import GuardList from "./GuardList/GuardList";
import OnboardGuard from "./OnboardGuard";

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
        }
    ]
}

export default onboard_guard_routes;