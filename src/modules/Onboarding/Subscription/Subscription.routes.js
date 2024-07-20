import Checkout from "./Checkout";
import PaymentFailure from "./PaymentFailure";
import PaymentSuccess from "./PaymentSuccess";
import Shop from "./Shop";
import Subscription from "./Subscription";

const subscription_routes = {
  path: "membership",
  element: <Subscription />,
  children: [
    {
      path: "",
      element: <Shop />,
    },
    {
      path: "shop",
      element: <Shop />,
    },
    {
      path: "checkout",
      element: <Checkout />,
    },
    {
      path: "successful",
      element: <PaymentSuccess />,
    },
    {
      path: "failed",
      element: <PaymentFailure />,
    },
  ],
};
const subscription_routes_empt = {
  path: "",
  element: <Subscription />,
  children: [
    {
      path: "",
      element: <Shop />,
    },
    {
      path: "shop",
      element: <Shop />,
    },
    {
      path: "checkout",
      element: <Checkout />,
    },
  ],
};

export default { subscription_routes, subscription_routes_empt };
