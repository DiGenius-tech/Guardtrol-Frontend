import Auth from "./Auth";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SetNewPassword from "./pages/SetNewPassword/SetNewPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import AuthRouteGuard from "../../shared/RouteGuard/AuthRouteGuard";

const auth_routes = {
    path: "/auth",
    element: <AuthRouteGuard component={Auth} />,
    children: [
        {
            path: "",
            element: <Login />
        },
        {
            path: "login",
            element: <Login />
        }, {
            path: "register",
            element: <Register />
        }, {
            path: "forgot-password",
            element: <ForgotPassword />
        }
        , {
            path: "set-new-password/:token",
            element: <SetNewPassword />
        },
        {
            path: "verify-email",
            element: <VerifyEmail />
        }
    ]
}

export default auth_routes;