import React, { useContext, useEffect, useState, useRef } from "react";
import { Dropdown, Flowbite, Select } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrganization, selectUser } from "../redux/selectors/auth";
import { logout, updateUserOrganization } from "../redux/slice/authSlice";
import { api } from "../redux/services/api";
import { persistor } from "../redux/store";
import { API_BASE_URL, ASSET_URL } from "../constants/api";
import { clientModuleList } from "../modules/Client/client.module-list";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetAllModificationsQuery } from "../redux/services/modifications";
import { FaBell } from "react-icons/fa";
import brandLogo from "../images/brand-logo.svg";
import { useGetUserOrganizationRoleQuery } from "../redux/services/role";
import { POOLING_TIME } from "../constants/static";
import { selectUnreadTickets } from "../redux/selectors/notification";
import { clearNotifications } from "../redux/slice/notificationSlice";

const ClientToolbar = (props) => {
  const organization = useSelector(selectOrganization);

  const {
    data: modifications,
    isLoading,
    refetch,
  } = useGetAllModificationsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleSetUserOrganization = (newOrg) => {
    dispatch(updateUserOrganization(newOrg));
  };

  useEffect(() => {
    if (user) {
      dispatch(updateUserOrganization(user?.roles?.[0]?.organization?._id));
    }
  }, [user]);

  const [isProfileDropdownOpened, setIsProfileDropdownOpened] = useState(false);
  const [isMobileProfileDropdownOpened, setIsMobileProfileDropdownOpened] =
    useState(false);
  const [isNotificationDropdownOpened, setIsNotificationDropdownOpened] =
    useState(false);
  const [moduleTitle, setModuleTitle] = useState("");

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  let location = useLocation();

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpened(!isProfileDropdownOpened);
  };

  const handleMobileProfileDropdownToggle = () => {
    setIsMobileProfileDropdownOpened(!isMobileProfileDropdownOpened);
  };

  const handleNotificationDropdownToggle = () => {
    setIsNotificationDropdownOpened(!isNotificationDropdownOpened);
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
  const confirmLogout = window.confirm("Are you sure you want to sign out?");
  if (!confirmLogout) return;

  persistor.purge();
  dispatch(api.util.resetApiState());
  dispatch(logout());
  dispatch(clearNotifications());
  navigate("/auth");
};


  const pendingCount = modifications?.filter(
    (mod) => mod.status === "pending"
  ).length;
  const unreadTickets = useSelector(selectUnreadTickets);

  const resolvedCount = modifications?.filter(
    (mod) => mod.status === "approved"
  ).length;

  const rejectedCount = modifications?.filter(
    (mod) => mod.status === "reverted"
  ).length;

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setIsProfileDropdownOpened(false);
    }
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="hidden sm:block bg-white">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex sm:h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
            <div className="flex flex-col justify-center sm:items-stretch sm:justify-start py-4">
              <h1 className="font-semibold">
                <img src={brandLogo} alt="Guardtrol" />
              </h1>
            </div>
            <div className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 flex">
              <div className="relative ml-3">
                <div className=" flex gap-2 justify-center items-center">
                  <Select
                    id="beat"
                    className="min-w-40 h-10"
                    value={organization}
                    onChange={(e) => {
                      handleSetUserOrganization(e.target.value);
                    }}
                    placeholder="Select Organization"
                  >
                    {user?.roles?.map((rol) => (
                      <option
                        key={rol?.organization?._id}
                        value={rol?.organization?._id}
                      >
                        {rol?.organization?.name} - {rol?.name}
                      </option>
                    ))}
                  </Select>
                  {(userRole?.name == "Owner" ||
                    userRole?.name == "Manager") && (
                    <div className="relative">
                      <button
                        onClick={handleNotificationDropdownToggle}
                        className="relative flex items-center text-gray-600 focus:outline-none"
                      >
                        <FaBell className="text-2xl" />
                        {(pendingCount > 0 || unreadTickets.length > 0) && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 pt-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                            {Number(pendingCount) +
                              Number(unreadTickets.length)}
                          </span>
                        )}
                      </button>
                      <div
                        ref={notificationDropdownRef}
                        className={
                          isNotificationDropdownOpened
                            ? `absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`
                            : "hidden"
                        }
                      >
                        <div className="block px-4 py-2 text-sm text-gray-700">
                          Pending modification requests: {pendingCount}
                        </div>
                        <div className="block px-4 py-2 text-sm text-gray-700">
                          Ticket Update: {unreadTickets.length}
                        </div>
                        {/* <div className="block px-4 py-2 text-sm text-gray-700">
                        Approved: {resolvedCount}
                      </div>
                      <div className="block px-4 py-2 text-sm text-gray-700">
                        Rejected: {rejectedCount}
                      </div> */}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleProfileDropdownToggle}
                    type="button"
                    className="relative w-fit h-fit flex rounded-full  bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    {!user?.image ? (
                      <div className="bg-secondary-50 h-8 w-8 rounded-full cursor-pointer flex items-center justify-center text-2xl font-bold">
                        {`${user?.name.split(" ")?.[0]?.[0] || ""} ${
                          user?.name.split(" ")?.[1]?.[0] || ""
                        }`}
                      </div>
                    ) : (
                      <img
                        className="h-8 w-8 rounded-full cursor-pointer"
                        src={
                          user?.image.includes("https")
                            ? user?.image
                            : ASSET_URL + user?.image
                        }
                        alt={"profile"}
                      />
                    )}
                  </button>
                </div>
                <div
                  ref={profileDropdownRef}
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
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    to="/client/settings/personal-information"
                  >
                    Your Profile
                  </Link>
                  {(userRole?.name == "Owner" ||
                    userRole?.name == "Manager") && (
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
                  )}
                  <a
                    href="#"
                    onClick={handleLogout}
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

      <nav className="sm:hidden bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center">
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
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={handleMobileProfileDropdownToggle}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full cursor-pointer"
                      src={
                        user?.image.includes("https")
                          ? user?.image
                          : ASSET_URL + user?.image
                      }
                      alt={"profile"}
                    />
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
                    onClick={handleLogout}
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
    </>
  );
};

export default ClientToolbar;
