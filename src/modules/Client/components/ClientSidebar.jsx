import { Flowbite, Sidebar } from "flowbite-react";
import React, { useEffect } from "react";
import {
  HiChartPie,
  HiClipboardList,
  HiFilter,
  HiHome,
  HiOutlineCog,
  HiUser,
  HiUsers,
} from "react-icons/hi";
import { customTheme } from "../../../flowbite-theme";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/selectors/auth";

const ClientSidebar = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  let use_params = useParams();
  /**QUERIES */
  const use_params_keys = [];
  for (const key in use_params) {
    if (Object.hasOwnProperty.call(use_params, key)) {
      use_params_keys.push(key);
    }
  }

  /**URLS */
  const dashboard = ["/client", "/client/"];
  const history = [
    "/client/history",
    "/client/history/",
    "/client/history/clock-in",
    "/client/history/clock-in/",
    "/client/history/clock-out",
    "/client/history/clock-out/",
    "/client/history/out-on-break",
    "/client/history/out-on-break/",
    "/client/history/patrols",
    "/client/history/patrols/",
  ];
  const patrol_guard = ["/client/patrol-guard", "/client/patrol-guard/"];
  const beats = [
    "/client/beats",
    "/client/beats/",
    "/client/beats/configure-beat",
    "/client/beats/configure-beat/",
  ];
  const reports = ["/client/reports", "/client/reports/"];
  const settings = [
    "/client/settings",
    "/ client / settings/",
    "/client/settings/personal-information",
    "/client/settings/personal-information/",
    "/client/settings/security",
    "/client/settings/security/",
    "/client/settings/shift-schedule",
    "/client/settings/shift-schedule/",
    "/client/settings/billing",
    "/client/settings/billing/",
    "/client/settings/billing/update-subscription",
    "/client/settings/billing/update-subscription/",
    "/client/settings/billing/checkout-subscription",
    "/client/settings/billing/checkout-subscription/",
  ];

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const params = {};

    for (const [key, value] of urlParams) {
      params[key] = value;
    }

    return () => {};
  }, []);

  return (
    <>
      {/* client-sidebar-app works! */}
      <aside aria-label="Sidebar">
        <div className="h-full pl-1 pr-2 py-4 overflow-y-auto dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={dashboard[0]}
                className={
                  (dashboard.includes(location.pathname)
                    ? `bg-primary-50 `
                    : ``) +
                  `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                }
              >
                <HiChartPie fontSize={"1.5rem"} />
                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={history[0]}
                className={
                  (history.includes(location.pathname)
                    ? `bg-primary-50 `
                    : ``) +
                  `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                }
              >
                <HiClipboardList fontSize={"1.5rem"} />
                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  History
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={patrol_guard[0]}
                className={
                  (patrol_guard.includes(location.pathname) ||
                  use_params_keys.includes("guardId")
                    ? `bg-primary-50 `
                    : ``) +
                  `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                }
              >
                <HiUser fontSize={"1.5rem"} />
                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  Guards
                </span>
              </Link>
            </li>
            {user.role === "Owner" && (
              <li>
                <Link
                  to={"/client/users"}
                  className={
                    (location.pathname.includes("/client/users") ||
                    use_params_keys.includes("userId")
                      ? `bg-primary-50 `
                      : ``) +
                    `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                  }
                >
                  <HiUsers fontSize={"1.5rem"} />
                  <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    Users
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link
                to={beats[0]}
                className={
                  (beats.includes(location.pathname) ||
                  use_params_keys.includes("beatId")
                    ? `bg-primary-50 `
                    : ``) +
                  `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                }
              >
                <HiHome fontSize={"1.5rem"} />
                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  Beats
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={reports[0]}
                className={
                  (reports.includes(location.pathname)
                    ? `bg-primary-50 `
                    : ``) +
                  `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                }
              >
                <HiFilter fontSize={"1.5rem"} />
                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  Reports
                </span>
              </Link>
            </li>
            {(user.role === "Owner" || user.role === "Manager") && (
              <li>
                <Link
                  to={settings[0]}
                  className={
                    (settings.includes(location.pathname)
                      ? `bg-primary-50 `
                      : ``) +
                    `flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group`
                  }
                >
                  <HiOutlineCog fontSize={"1.5rem"} />
                  <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    Settings
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default ClientSidebar;
