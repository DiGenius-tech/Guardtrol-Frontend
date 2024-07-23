import React, { useContext, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/slice/authSlice";
import { selectUser } from "../../../../redux/selectors/auth";
import { api } from "../../../../redux/services/api";
import { persistor } from "../../../../redux/store";
import { PURGE } from "redux-persist";
import { ASSET_URL } from "../../../../constants/api";

const OnboardingToolbar = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProfileDropdownOpened, setIsProfileDropdownOpened] = useState(false);

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpened(!isProfileDropdownOpened);
  };

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };
  return (
    <>
      {/* onboarding-toolbar-app works! */}

      <nav className="bg-secondary-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex sm:h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
            <div className="flex flex-col justify-center sm:items-stretch sm:justify-start py-4">
              <h1 className="text-[#F9FAFA] font-semibold">Onboarding</h1>
              <p className="text-[#9BA2A7] text-xs sm:text-sm">
                Complete this onboarding process to start using Guardtrol
              </p>
            </div>
            <div className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:flex">
              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => handleProfileDropdownToggle()}
                    type="button"
                    className="relative  flex rounded-full  bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`${ASSET_URL + user?.image}` || null}
                      alt=""
                    />
                  </button>
                </div>

                {/* <!--
                                Dropdown menu, show/hide based on menu state.

                                Entering: "transition ease-out duration-100"
                                From: "transform opacity-0 scale-95"
                                To: "transform opacity-100 scale-100"
                                Leaving: "transition ease-in duration-75"
                                From: "transform opacity-100 scale-100"
                                To: "transform opacity-0 scale-95"
          --> */}
                {/* <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1"> */}
                <div
                  className={
                    isProfileDropdownOpened
                      ? `absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`
                      : "hidden"
                  }
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                  >
                    Settings
                  </a>
                  <a
                    onClick={() => handleLogout()}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    style={{ cursor: "pointer" }}
                    id="user-menu-item-2"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default OnboardingToolbar;
