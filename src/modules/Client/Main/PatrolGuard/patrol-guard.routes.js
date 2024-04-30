import AddGuard from "../../../Onboarding/pages/OnboardGuard/AddGuard/AddGuard";
import ActivateGuard from "./ActivateGuard/ActivateGuard";
import PatrolGuard from "./PatrolGuard";
import PatrolGuardDetails from "./PatrolGuardDetails/PatrolGuardDetails";
import ActivePatrolGuards from "./PatrolGuardList/ActivePatrolGuards/ActivePatrolGuards";
import InactivePatrolGuards from "./PatrolGuardList/InactivePatrolGuards/InactivePatrolGuards";
import PatrolGuardList from "./PatrolGuardList/PatrolGuardList";

const patrol_guard_routes = {
  path: "patrol-guard",
  element: <PatrolGuardList />,
  children: [
    {
      path: "",
      element: <ActivePatrolGuards />,
    },
    {
      path: "active",
      element: <ActivePatrolGuards />,
    },
    {
      path: "inactive",
      element: <InactivePatrolGuards />,
    },
    {
      path: "addguard",
      element: <AddGuard onBoarding={false} />,
    },

    {
      path: "details/:guardId",
      element: <PatrolGuardDetails />,
    },
    {
      path: "activate/:guardId",
      element: <ActivateGuard />,
    },
  ],
};
const patrol_guard_routes_empt = {
  path: "",
  element: <PatrolGuard />,
  children: [],
};

export default { patrol_guard_routes, patrol_guard_routes_empt };
