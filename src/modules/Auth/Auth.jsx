import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthToolbar from "./AuthToolbar";

const Auth = () => {
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
