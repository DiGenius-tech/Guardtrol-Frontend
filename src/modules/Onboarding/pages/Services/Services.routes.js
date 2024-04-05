import Checkout from "./Checkout/Checkout";
import PaymentFailure from "./PaymentFailure/PaymentFailure";
import PaymentSuccess from "./PaymentSuccess/PaymentSuccess";
import Services from "./Services";
import Shop from "./Shop/Shop";

const services_routes = {
    path: "services",
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
}
const services_routes_empt = {
    path: "services",
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
    ]
}

export default { services_routes, services_routes_empt };