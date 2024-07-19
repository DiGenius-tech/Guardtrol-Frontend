import { Route, Routes } from "react-router-dom";
import AuthLayout from "./auth-layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SetNewPassword from "./pages/SetNewPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";
import LogOut from "./pages/LogOut";

const AuthRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<LogOut />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="set-new-password/:token" element={<SetNewPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
      </Route>
    </Routes>
  );
};

export { AuthRouter };
