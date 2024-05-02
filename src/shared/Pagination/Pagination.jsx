import React from 'react';
import { FcNext } from "react-icons/fc";
import { FcPrevious } from "react-icons/fc";
import "./Pagination.scss";

const Pagination = () => {
    return (
        <>
            {/* pagination-app works! */}

            <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex">
                        <span className="text-center border border-gray-300 text-sm rounded-lg block min-w-8 h-8 p-2.5">1</span>
                    </div>
                    <div>of&nbsp;25</div>
                    <div className="flex items-center">
                        <button className="icon-btn cursor-pointer text-center text-dark-70 hover:text-dark-260 bg-accent-200 hover:bg-accent-300 border border-accent-500 hover:border-accent-550 text-sm rounded-l-lg block w-full p-2.5 min-w-8 h-8">
                            <FcPrevious style={{
                                color: 'red',
                                polygon: {
                                    fill: 'red'
                                }
                            }} />
                        </button>
                        <button className="icon-btn cursor-pointer text-center text-dark-70 hover:text-dark-260 bg-accent-200 hover:bg-accent-300 border border-accent-500 hover:border-accent-550 text-sm rounded-r-lg block w-full p-2.5 min-w-8 h-8">
                            <FcNext />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <label for="entriesPerPage" class="text-nowrap block text-sm font-medium text-gray-900">Entries per page:</label>
                    <select id="entriesPerPage" class="bg-transparent cursor-pointer text-sm block w-full border-0 focus:border-0 focus:ring-0">
                        <option selected>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                </div></div>
        </>
    );
}

export default Pagination;
