import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Onboarding from "./Onboarding";
import AssignBeats from "./pages/AssignBeats/AssignBeats";
import configure_beats_routes from "./pages/ConfigureBeats/ConfigureBeats.routes";
import servicesRoutes from "./pages/Services/Services.routes";
import onboard_guard_routes from "./pages/OnboardGuard/OnboardGuard.routes";
import Membership from "./pages/Membership/Membership";
import Services from "./pages/Services/Services";
import Shop from "./pages/Services/Shop/Shop";
import Checkout from "./pages/Services/Checkout/Checkout";
import PaymentSuccess from "./pages/Services/PaymentSuccess/PaymentSuccess";
import PaymentFailure from "./pages/Services/PaymentFailure/PaymentFailure";

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
            path: "membership",
            // element: <Membership />
            element: <Services />,
            children: [
                {
                    path: "",
                    element: <Shop />
                },
                {
                    path: "shop",
                    element: <Shop />
                },
                {
                    path: "checkout",
                    element: <Checkout />
                },
                {
                    path: "successful",
                    element: <PaymentSuccess />
                },
                {
                    path: "failed",
                    element: <PaymentFailure />
                },
            ]
        },
        {
            path: "assign-beats",
            element: <AssignBeats />
        }
    ]
}

export default onboarding_routes;