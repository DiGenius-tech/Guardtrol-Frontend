import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Onboarding from "./Onboarding";
import AssignBeats from "./pages/AssignBeats/AssignBeats";
import configure_beats_routes from "./pages/ConfigureBeats/ConfigureBeats.routes";
import servicesRoutes from "./pages/Services/Services.routes";
import onboard_guard_routes from "./pages/OnboardGuard/OnboardGuard.routes";

const { services_routes, services_routes_empt } = servicesRoutes

const onboarding_routes = {
    path: "/onboarding",
    element: <PrivateRoute component={Onboarding} onboarding={true} />,
    children: [
        services_routes_empt,
        services_routes,
        configure_beats_routes,
        onboard_guard_routes,
        {
            path: "assign-beats",
            element: <AssignBeats />
        }
    ]
}

export default onboarding_routes;