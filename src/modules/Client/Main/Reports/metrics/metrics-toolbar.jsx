import { Link, useLocation, useParams } from "react-router-dom";

function MetricsToolbar() {
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
              to={`/client/reports/metrics/beats`}
              className={
                (location.pathname.includes("reports/metrics/beats")
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Beats
            </Link>
          </li>
          <li>
            <Link
              to={`/client/reports/metrics/guards`}
              className={
                (location.pathname.includes("reports/metrics/guards")
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Guards
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MetricsToolbar;
