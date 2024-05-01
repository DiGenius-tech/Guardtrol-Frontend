import { Link, useLocation, useParams } from "react-router-dom";

function BeatDetailsHeader() {
  const location = useLocation();
  /**URLS */
  const { beatId } = useParams();

  const active = [`/client/beats/details/${beatId}`];
  return (
    <>
      <nav>
        <ul className="flex gap-2 text-center -mb-px flex-wrap  border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={``}
              className={
                (location.pathname == `/client/beats/details/${beatId}`
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Beat Info
            </Link>
          </li>
          <li>
            <Link
              to={`beat-guards`}
              className={
                (location.pathname ==
                `/client/beats/details/${beatId}/beat-guards`
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Beat Guards
            </Link>
          </li>
          <li>
            <Link
              to={`beat-patrol`}
              className={
                (location.pathname ==
                `/client/beats/details/${beatId}/beat-patrol`
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Beat Patrol
            </Link>
          </li>
          <li>
            <Link
              to={`beat-report`}
              className={
                (location.pathname ==
                `/client/beats/details/${beatId}/beat-report`
                  ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                  : `border-transparent `) +
                `flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
              }
            >
              Beat Reports
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default BeatDetailsHeader;
