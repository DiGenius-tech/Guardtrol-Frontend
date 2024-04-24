import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SettingsToolbar = () => {
    const location = useLocation();
    /**URLS */
    const personalInformation = [
        "/client/settings",
        "/client/settings/",
        "/client/settings/personal-information",
        "/client/settings/personal-information/",
    ];
    const settings = [
        "/client/settings/security",
        "/client/settings/security/"
    ];
    const shiftSchedule = [
        "/client/settings/shift-schedule",
        "/client/settings/shift-schedule/"
    ];
    const billing = [
        "/client/settings/billing",
        "/client/settings/billing/"
    ];


    return (
        <>
            {/* settings-toolbar-app works! */}

            <nav>
                {/*  active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 */}
                <ul className="flex gap-2 flex-nowrap overflow-auto text-center -mb-px border-b border-gray-200 dark:border-gray-700">
                    <li>
                        <Link
                            to={`personal-information`}
                            className={
                                (personalInformation.includes(location.pathname)
                                    ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                                    : `border-transparent `) +
                                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
                            }
                        >
                            Personal information
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`security`}
                            className={
                                (settings.includes(location.pathname)
                                    ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                                    : `border-transparent `) +
                                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
                            }
                        >
                            Security
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`shift-schedule`}
                            className={
                                (shiftSchedule.includes(location.pathname)
                                    ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                                    : `border-transparent `) +
                                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
                            }
                        >
                            Shift schedule
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`billing`}
                            className={
                                (billing.includes(location.pathname)
                                    ? `active border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500 `
                                    : `border-transparent `) +
                                `flex items-center justify-center whitespace-nowrap p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 rounded-t-lg border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300`
                            }
                        >
                            Billing
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default SettingsToolbar;
