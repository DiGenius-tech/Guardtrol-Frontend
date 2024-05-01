import React, { useContext, useEffect, useState } from "react";

import { Dropdown, Flowbite } from "flowbite-react";
import { customTheme } from "../../../flowbite-theme";
import brandLogo from "../../../images/brand-logo.svg";
import { HiMenu } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { clientModuleList } from "../client.module-list";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, selectUser } from "../../../redux/selectors/auth";
import { logout } from "../../../redux/slice/authSlice";
import { api } from "../../../redux/services/api";
import { persistor, store } from "../../../redux/store";
import { ScreenRotationSharp } from "@mui/icons-material";
import { PURGE } from "redux-persist";

const ClientToolbar = (props) => {
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isProfileDropdownOpened, setIsProfileDropdownOpened] = useState(false);
  const [isMobileProfileDropdownOpened, setIsMobileProfileDropdownOpened] =
    useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  let location = useLocation();

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpened(!isProfileDropdownOpened);
  };

  const handleMobileProfileDropdownToggle = () => {
    setIsMobileProfileDropdownOpened(!isMobileProfileDropdownOpened);
  };

  useEffect(() => {
    if (clientModuleList.dashboard.pathnames.includes(location.pathname))
      setModuleTitle(clientModuleList.dashboard.title);
    if (clientModuleList.history.pathnames.includes(location.pathname))
      setModuleTitle(clientModuleList.history.title);
    if (clientModuleList.guard.pathnames.includes(location.pathname))
      setModuleTitle(clientModuleList.guard.title);
    if (clientModuleList.beats.pathnames.includes(location.pathname))
      setModuleTitle(clientModuleList.beats.title);
    if (clientModuleList.settings.pathnames.includes(location.pathname))
      setModuleTitle(clientModuleList.settings.title);
    return () => {};
  }, [location]);

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };
  return (
    <>
      {/* clientToolbar-app works! */}

      <nav className="hidden sm:block bg-white">
        {/* <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"> */}
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex sm:h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
            <div className="flex flex-col justify-center sm:items-stretch sm:justify-start py-4">
              {/* <h1 className='font-semibold'>Onboarding</h1> */}
              <h1 className="font-semibold">
                <img src={brandLogo} alt="Guardtrol" />
              </h1>
            </div>
            <div className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 flex">
              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => handleProfileDropdownToggle()}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {(
                      <img
                        className="h-8 w-8 rounded-full cursor-pointer"
                        src={user?.image || null}
                        alt={"profile"}
                      />
                    )}
                  </button>
                </div>
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
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={() => navigate("/client/settings/billing")}
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                    onClick={() => navigate("/client/settings")}
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    onClick={() => handleLogout()}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
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

      {/* Toolbar for mobile */}
      <nav className="sm:hidden bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                onClick={props.handleOpenSidenav}
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                {!props.isOpenSidenav ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="font-bold text-xl sm:text-2xl first-letter:uppercase">
                  {moduleTitle}
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  <a
                    href="#"
                    className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    aria-current="page"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Team
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Projects
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Calendar
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <!-- Profile dropdown --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => handleMobileProfileDropdownToggle()}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {(
                      <img
                        className="h-8 w-8 rounded-full cursor-pointer"
                        src={user?.image || null}
                        alt={"profile"}
                      />
                    )}
                  </button>
                </div>
                <div
                  className={
                    isMobileProfileDropdownOpened
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
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={() => navigate("/client/settings/billing")}
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                    onClick={() => navigate("/client/settings")}
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      dispatch(logout());
                      navigate("/auth");
                    }}
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    style={{ cursor: "pointer" }}
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

export default ClientToolbar;
