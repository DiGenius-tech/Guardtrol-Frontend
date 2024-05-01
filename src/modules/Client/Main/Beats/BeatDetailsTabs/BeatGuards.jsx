import React from "react";
import PatrolGuardListDesktopView from "../../PatrolGuard/PatrolGuardList/PatrolGuardListDesktopView/PatrolGuardListDesktopView";
import { DUTY_STATUS } from "../../../../../constants/statics";
import icon_menu_dots from "../../../../../images/icons/icon-menu-dots.svg";
import PatrolGuardList from "../../PatrolGuard/PatrolGuardList/PatrolGuardList";
import AddGuard from "../../../../Onboarding/pages/OnboardGuard/AddGuard/AddGuard";
import { Link, useLocation, useParams } from "react-router-dom";
import ActivePatrolGuards from "../../PatrolGuard/PatrolGuardList/ActivePatrolGuards/ActivePatrolGuards";
import InactivePatrolGuards from "../../PatrolGuard/PatrolGuardList/InactivePatrolGuards/InactivePatrolGuards";

const BeatGuards = () => {
  const location = useLocation();
  const { beatId } = useParams();
  const active = [
    `/client/beats/details/${beatId}`,
    `/client/beats/details/${beatId}/active`,
  ];
  const inactive = [`/client/beats/details/${beatId}/inactive`];
  const addguard = [`/client/beats/details/${beatId}/addguard`];

  return (
    <>
      <nav>
        {/*  active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 */}
        <ul className="flex gap-2 text-center -mb-px flex-wrap border-b border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={`active`}
              className={
                (active.includes(location.pathname)
                  ? `active  border-gray-500 text-gray hover:border-gray-400 hover:text-gray-400 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Active
            </Link>
          </li>
          <li>
            <Link
              to={`inactive`}
              className={
                (inactive.includes(location.pathname)
                  ? `active  border-gray-500 text-gray hover:border-gray-400 hover:text-gray-400 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Inactive
            </Link>
          </li>
          <li>
            <Link
              to={`addguard`}
              className={
                (addguard.includes(location.pathname)
                  ? `active  border-gray-500 text-gray hover:border-gray-400 hover:text-gray-400 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Assign Guard
            </Link>
          </li>
        </ul>
      </nav>
      <div className=" mt-7">
        {active.includes(location.pathname) && <ActivePatrolGuards />}
        {inactive.includes(location.pathname) && <InactivePatrolGuards />}
        {addguard.includes(location.pathname) && (
          <AddGuard onBoarding={false} />
        )}
      </div>
    </>
  );
};

export default BeatGuards;
