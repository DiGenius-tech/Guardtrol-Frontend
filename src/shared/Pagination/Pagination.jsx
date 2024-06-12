import React, { useState } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";

const Pagination = ({
  totalEntries = 0,
  entriesPerPage = 0,
  currentPage = 0,
  onPageChange = null,
  onEntriesPerPageChange = null,
}) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center flex-wrap gap-4 absolute bottom-0 right-0">
      <div className="flex items-center gap-4">
        <div className="flex">
          <span className="text-center border border-gray-300 text-sm rounded-lg block min-w-8 h-8 p-2.5 pt-1.5">
            {currentPage}
          </span>
        </div>
        <div>of&nbsp;{totalPages || 1}</div>
        <div className="flex items-center">
          <button
            className="icon-btn cursor-pointer text-center text-dark-70 hover:text-dark-260 bg-accent-200 hover:bg-accent-300 border border-accent-500 hover:border-accent-550 text-sm rounded-l-lg block w-full p-2.5 min-w-8 h-8"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <FcPrevious />
          </button>
          <button
            className="icon-btn cursor-pointer text-center text-dark-70 hover:text-dark-260 bg-accent-200 hover:bg-accent-300 border border-accent-500 hover:border-accent-550 text-sm rounded-r-lg block w-full p-2.5 min-w-8 h-8"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <FcNext />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="entriesPerPage"
          className="text-nowrap block text-sm font-medium text-gray-900"
        >
          Entries per page:
        </label>
        <select
          id="entriesPerPage"
          className="bg-transparent cursor-pointer text-sm block w-full border-0 focus:border-0 focus:ring-0"
          value={entriesPerPage}
          onChange={(e) => onEntriesPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
