import React from "react";
import { Link, useLocation } from "react-router-dom";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { useGetUserOrganizationRoleQuery } from "../../../redux/services/role";

const SettingsToolbar = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  /**URLS */
  const organization = useSelector(selectOrganization);
  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });

  const personalInformation = [
    "/client/settings",
    "/client/settings/",
    "/client/settings/personal-information",
    "/client/settings/personal-information/",
  ];
  const settings = ["/client/settings/security", "/client/settings/security/"];
  const shiftSchedule = [
    "/client/settings/shift-schedule",
    "/client/settings/shift-schedule/",
  ];
  const billing = [
    "/client/settings/billing",
    "/client/settings/billing/",
    "/client/settings/billing/checkout-subscription",
    "/client/settings/billing/checkout-subscription/",
    "/client/settings/billing/update-subscription",
    "/client/settings/billing/update-subscription/",
  ];

  return (
    <>
      <nav>
        <ul className="remove-scrollbar flex gap-2 flex-nowrap overflow-auto text-center -mb-px border-b border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={`personal-information`}
              className={
                (personalInformation.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Personal Information
            </Link>
          </li>

          <li>
            <Link
              to={`security`}
              className={
                (settings.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Security
            </Link>
          </li>
          {/* <li>
            <Link
              to={`shift-schedule`}
              className={
                (shiftSchedule.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Shift Schedule
            </Link>
          </li> */}
          {(userRole?.name === "Owner" || userRole?.name === "Manager") && (
            <li>
              <Link
                to={`billing`}
                className={
                  (billing.includes(location.pathname)
                    ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                    : `border-transparent `) +
                  `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
                }
              >
                Billing
              </Link>
            </li>
          )}
          {(userRole?.name === "Owner" || userRole?.name === "Manager") && (
            <li>
              <Link
                to={`notification`}
                className={
                  (location.pathname.includes("notification")
                    ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                    : `border-transparent `) +
                  `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
                }
              >
                Notification
              </Link>
            </li>
          )}
          {userRole?.name === "Owner" && (
            <li>
              <Link
                to={`users`}
                className={
                  (location.pathname.includes("users")
                    ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                    : `border-transparent `) +
                  `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
                }
              >
                Users
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default SettingsToolbar;
