import Auth from "./Auth";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SetNewPassword from "./pages/SetNewPassword/SetNewPassword";

const auth_routes = {
    path: "/auth",
    element: <Auth />,
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
            path: "set-new-password",
            element: <SetNewPassword />
        }
    ]
}

export default auth_routes;