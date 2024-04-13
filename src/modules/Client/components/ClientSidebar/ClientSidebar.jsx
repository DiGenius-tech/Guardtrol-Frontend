import { Flowbite, Sidebar } from 'flowbite-react';
import React from 'react';
import {
    HiChartPie,
    HiClipboardList,
    HiHome,
    HiOutlineCog,
    HiUser,
} from "react-icons/hi";
import { customTheme } from '../../../../flowbite-theme';
import { Link } from 'react-router-dom';


const ClientSidebar = () => {
    return (
        <>
            {/* client-sidebar-app works! */}
            {/* fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 */}
            <aside aria-label="Sidebar">
                <div className="h-full pl-1 pr-2 py-4 overflow-y-auto dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/client/dashboard" className="flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group">
                                <HiChartPie fontSize={'1.5rem'} />
                                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/client/history" className="flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group">
                                <HiClipboardList fontSize={'1.5rem'} />
                                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">History</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/client/patrol-guard" className="flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group">
                                <HiUser fontSize={'1.5rem'} />
                                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Guards</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/client/beats" className="flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group">
                                <HiHome fontSize={'1.5rem'} />
                                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Beats</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/client/settings" className="flex items-center p-2 text-dark-260 rounded-r-full dark:text-white hover:bg-primary-50 dark:hover:bg-primary-400 group">
                                <HiOutlineCog fontSize={'1.5rem'} />
                                <span className="flex items-center ms-3 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default ClientSidebar;
