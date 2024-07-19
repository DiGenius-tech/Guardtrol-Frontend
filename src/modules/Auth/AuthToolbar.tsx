import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import brandLogo from "../../images/brand-logo.svg";
import { selectAuth, selectUser } from "../../redux/selectors/auth";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";

const AuthToolbar = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
  };
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
              {user ? (
                <div
                  onClick={() => handleLogout()}
                  className={`rounded-md py-2 cursor-pointer text-sm font-medium text-primary-500`}
                >
                  {"Logout"}
                </div>
              ) : (
                <>
                  {!location.pathname.includes("register") ? (
                    <NavLink
                      to={"/auth/register"}
                      className={`rounded-md py-2 text-sm font-medium text-primary-500`}
                    >
                      {"Create an Account"}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={"/auth/login"}
                      className={`rounded-md py-2 text-sm font-medium text-primary-500`}
                    >
                      {"Login"}
                    </NavLink>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AuthToolbar;
