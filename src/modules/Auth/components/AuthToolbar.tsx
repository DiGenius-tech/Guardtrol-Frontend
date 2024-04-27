import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuth,
  selectIsUserLoggedIn,
  selectUser,
} from "../../../redux/selectors/auth";
import { toAbsoluteUrl } from "../../../utils/assetHelper";
import brandLogo from "../../../images/brand-logo.svg";

const AuthToolbar = () => {
  const location = useLocation();
  const auth = useSelector(selectAuth);

  return (
    <>
      {/* auth-toolbar-app works! */}
      <nav className="bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start sm:items-stretch">
              <div className="flex flex-shrink-0 items-center min-w-5">
                <img src={brandLogo} alt="Guardtrol" />
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <NavLink
                to={auth.isAuthenticated ? "/client/dashboard" : "/auth/register"}
                className={`${
                  location.pathname === "/auth/register" ||
                  location.pathname === "/auth/register/" ||
                  location.pathname === "/auth/forgot-password" ||
                  location.pathname === "/auth/forgot-password/" ||
                  location.pathname.includes("/auth/set-new-password") ||
                  location.pathname === "/auth/verify-email"
                    ? "hidden"
                    : "rounded-md py-2 text-sm font-medium text-primary-500"
                }`}
              >
                {auth.isAuthenticated ? "Dashboard" : "Create An Account"}
              </NavLink>
              <NavLink
                to={auth.isAuthenticated ? "/client/dashboard" : "/auth/login"}
                className={`${
                  location.pathname === "/auth/login" ||
                  location.pathname === "/auth/login/" ||
                  location.pathname === "/auth" ||
                  location.pathname === "/auth/"
                    ? "hidden"
                    : "rounded-md py-2 text-sm font-medium text-primary-500"
                }`}
              >
                {auth.isAuthenticated ? "Dashboard" : "Login"}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AuthToolbar;
