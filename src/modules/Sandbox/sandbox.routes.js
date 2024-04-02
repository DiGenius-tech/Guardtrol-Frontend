import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import PasswordEventTest from "./PasswordEventTest/PasswordEventTest";
import Sandbox from "./Sandbox";

const sandbox_routes = {
    path: "/sandbox",
    element: <Sandbox />,
    children: [
        {
            path: "loading-spinner",
            element: <LoadingSpinner />
        },
        {
            path: "password-event-test",
            element: <PasswordEventTest />
        }
    ]
}

export default sandbox_routes;