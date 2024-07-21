import { Link, useLocation, useParams } from "react-router-dom";

function RequestToolbar() {
  const location = useLocation();
  const { beatId } = useParams();
  /**URLS */

  return (
    <>
      {/* patrol-guard-list-toolbar-app works! */}
      <nav>
        {/*  active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 */}
        <ul className="flex gap-2 text-center -mb-px flex-wrap border-b border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={`/client/requests/guards`}
              className={
                (location.pathname.includes("requests/guards")
                  ? `active font-semibold border-primary-500 bg-primary-500 text-white hover:border-primary-200 hover:text-white `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500  border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Guard
            </Link>
          </li>
          <li>
            <Link
              to={`/client/requests/beats`}
              className={
                (location.pathname.includes("requests/beats")
                  ? `active font-semibold border-primary-500 bg-primary-500 text-white hover:border-primary-200 hover:text-white `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500  border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beat
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default RequestToolbar;
