import Checkout from "./Checkout/Checkout";
import Membership from "./Membership";
import Shop from "./Shop/Shop";

const membership_routes = {
    path: "membership",
    element: <Membership />,
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
    ]
}
const membership_routes_empt = {
    path: "membership",
    element: <Membership />,
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
    ]
}

export default {membership_routes, membership_routes_empt};