import AddGuard from "./AddGuard";
import GuardList from "./GuardList";
import OnboardGuard from "./OnboardGuard";
import UpdateGuard from "./UpdateGuard";

const onboard_guard_routes = {
  path: "onboard-guard",
  element: <OnboardGuard />,
  children: [
    {
      path: "",
      element: <GuardList />,
    },
    {
      path: "add-guard",
      element: <AddGuard />,
    },
  ],
};

export default onboard_guard_routes;
