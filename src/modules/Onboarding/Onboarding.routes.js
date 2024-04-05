import Onboarding from "./Onboarding";
import AssignBeats from "./pages/AssignBeats/AssignBeats";
import configure_beats_routes from "./pages/ConfigureBeats/ConfigureBeats.routes";
import membershipRoutes from "./pages/Membership/Membership.routes";
import onboard_guard_routes from "./pages/OnboardGuard/OnboardGuard.routes";

const { membership_routes, membership_routes_empt } = membershipRoutes

const onboarding_routes = {
    path: "/onboarding",
    element: <Onboarding />,
    children: [
        membership_routes_empt,
        membership_routes,
        configure_beats_routes,
        onboard_guard_routes,
        {
            path: "assign-beats",
            element: <AssignBeats />
        }
    ]
}

export default onboarding_routes;