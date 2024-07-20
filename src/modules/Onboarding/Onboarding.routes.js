import PrivateRoute from "../../shared/RouteGuard/PrivateRoute";
import Onboarding from "./Onboarding";
import AssignBeats from "./AssignBeats/AssignBeats";
import configure_beats_routes from "./ConfigureBeats/ConfigureBeats.routes";
import subscriptionRoutes from "./Subscription/Subscription.routes";
import onboard_guard_routes from "./OnboardGuard/OnboardGuard.routes";
import Membership from "./Membership";
import Shop from "./Subscription/Shop";
import Checkout from "./Subscription/Checkout";
import PaymentSuccess from "./Subscription/PaymentSuccess";
import PaymentFailure from "./Subscription/PaymentFailure";
import Subscription from "./Subscription/Subscription";
import assign_beats_routes from "./AssignBeats/AssignBeats.routes";
import OnboardingComplete from "./CompleteOnboarding";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import AddBeat from "./ConfigureBeats/AddBeat";

const { subscription_routes, subscription_routes_empt } = subscriptionRoutes;

const onboarding_routes = {
  path: "/onboarding",
  element: <PrivateRoute component={Onboarding} onboarding={true} />,
  children: [
    {
      path: "/onboarding/complete",
      element: <OnboardingComplete />,
    },
    subscription_routes_empt,
    subscription_routes,
    configure_beats_routes,
    onboard_guard_routes,
    assign_beats_routes,
  ],
};

export default onboarding_routes;
