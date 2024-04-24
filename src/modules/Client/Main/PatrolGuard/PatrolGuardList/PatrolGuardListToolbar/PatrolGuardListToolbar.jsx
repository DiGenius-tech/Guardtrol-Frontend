import { Link, useLocation } from "react-router-dom";

function PatrolGuardListToolbar() {
  const location = useLocation();
  /**URLS */
  const active = [
    "/client/patrol-guard",
    "/client/patrol-guard/",
    "/client/patrol-guard/active",
    "/client/patrol-guard/active/"
  ];
  const inactive = [
    "/client/patrol-guard/inactive",
    "/client/patrol-guard/inactive/"
  ];
  return (
    <>
      {/* patrol-guard-list-toolbar-app works! */}
      <nav>
        {/*  active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 */}
        <ul className="flex gap-2 text-center -mb-px flex-wrap border-b border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={`active`}
              className={
                (active.includes(location.pathname)
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
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
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Inactive
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default PatrolGuardListToolbar;
