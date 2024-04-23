import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthToolbar from "./components/AuthToolbar";
import { AuthContext } from "../../shared/Context/AuthContext";

const Auth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen">
        {/* auth-app works! */}
        <AuthToolbar />
        <Outlet />
      </div>
    </>
  );
};

export default Auth;
