import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Onboarding from "./Onboarding";
import AssignBeats from "./pages/AssignBeats/AssignBeats";
import configure_beats_routes from "./pages/ConfigureBeats/ConfigureBeats.routes";
import subscriptionRoutes from "./pages/Subscription/Subscription.routes";
import onboard_guard_routes from "./pages/OnboardGuard/OnboardGuard.routes";
import Membership from "./pages/Membership/Membership";
import Shop from "./pages/Subscription/Shop/Shop";
import Checkout from "./pages/Subscription/Checkout/Checkout";
import PaymentSuccess from "./pages/Subscription/PaymentSuccess/PaymentSuccess";
import PaymentFailure from "./pages/Subscription/PaymentFailure/PaymentFailure";
import Subscription from "./pages/Subscription/Subscription";
import assign_beats_routes from "./pages/AssignBeats/AssignBeats.routes";

const { subscription_routes, subscription_routes_empt } = subscriptionRoutes

const onboarding_routes = {
    path: "/onboarding",
    element: <PrivateRoute component={Onboarding} onboarding={true} />,
    children: [
        subscription_routes_empt,
        subscription_routes,
        configure_beats_routes,
        onboard_guard_routes,
        assign_beats_routes
    ]
}

export default onboarding_routes;