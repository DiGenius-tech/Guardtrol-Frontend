import PrivateRoute from "../../shared/PrivateRoute";
import Onboarding from "./Onboarding";
import AssignBeats from "./pages/AssignBeats/AssignBeats";
import ConfigureBeats from "./pages/ConfigureBeats/ConfigureBeats";
import configure_beats_routes from "./pages/ConfigureBeats/ConfigureBeats.routes";
import Membership from "./pages/Membership/Membership";
import OnboardGuard from "./pages/OnboardGuard/OnboardGuard";
import onboard_guard_routes from "./pages/OnboardGuard/OnboardGuard.routes";

const onboarding_routes = {
    path: "/onboarding",
    element: <PrivateRoute component={Onboarding} />,
    children: [
        {
            path: "",
            element: <Membership />
        },
        {
            path: "membership",
            element: <Membership />
        },
        // {
        //     path: "configure-beats",
        //     element: <ConfigureBeats />
        // },
        configure_beats_routes,

        // {
        //     path: "onboard-guard",
        //     element: <OnboardGuard />
        // }, 
        onboard_guard_routes,

        {
            path: "assign-beats",
            element: <AssignBeats />
        }
    ]
}

export default onboarding_routes;