import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Sandbox from "./Sandbox";
import StepperWidget from "./StepperWidget/StepperWidget";

const sandbox_routes = {
    path: "/sandbox",
    element: <Sandbox />,
    children: [
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        },
        {
            path: "stepper-widget",
            element: <StepperWidget />
        }
    ]
}

export default sandbox_routes;