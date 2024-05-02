import { Link, useLocation } from "react-router-dom";

function HistoryToolbar() {
  const location = useLocation();
  /**URLS */
  const clockIn = [
    "/client/history",
    "/client/history/",
    "/client/history/clock-in",
    "/client/history/clock-in/"
  ];
  const clockOut = ["/client/history/clock-out", "/client/history/clock-out/"];
  const outOnBreak = [
    "/client/history/out-on-break",
    "/client/history/out-on-break/"
  ];
  const patrols = ["/client/history/patrols", "/client/history/patrols/"];
  return (
    <>
      {/* historyT-toolbar-app works! */}

      <nav>
        <ul className="remove-scrollbar flex gap-2 flex-nowrap overflow-auto text-center -mb-px border-b border-gray-200 dark:border-gray-700">
          <li>
            <Link
              to={`clock-in`}
              className={
                (clockIn.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Clock in
            </Link>
          </li>
          <li>
            <Link
              to={`clock-out`}
              className={
                (clockOut.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Clock out
            </Link>
          </li>
          <li>
            <Link
              to={`out-on-break`}
              className={
                (outOnBreak.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Out on break
            </Link>
          </li>
          <li>
            <Link
              to={`patrols`}
              className={
                (patrols.includes(location.pathname)
                  ? `active font-semibold border-primary-500 text-primary-500 hover:border-primary-400 hover:text-primary-400 `
                  : `border-transparent `) +
                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600`
              }
            >
              Patrols
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default HistoryToolbar;
