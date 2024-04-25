import React from "react";
import { Link } from "react-router-dom";

const BeatReport = ({ setPage, beat }) => {
  return (
    <>
      <div className="flex justify-between flex-row my-2">
        <h5 className="text-md font-bold text-primary-500 dark:text-white">
          Report Metrics
        </h5>

        <span
          onClick={() => setPage("EditBeatInformation")}
          className="text-primary-500 font-semibold text-sm cursor-pointer"
        >
          Export
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 xl:col-span-6">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Summary
              </h4>
            </div>
            <hr />
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Name
              </h5>
              <div className="">
                <span className="text-md text-gray-700 font-medium cursor-pointer dark:text-white">
                  {beat?.name || "No Name"}
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Location
              </h5>
              <div className="">
                <span className="text-md font-medium cursor-pointer dark:text-white">
                  {beat?.address || "No Address"}
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Beat Guards
              </h5>

              <div className="">
                <span className="text-md font-medium cursor-pointer dark:text-white">
                  {beat?.guards.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex justify-between flex-row">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Activities
              </h4>
            </div>
            <hr />
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Most recent patrol
              </h5>
              <div className="">
                <span className="text-md font-medium cursor-pointer dark:text-white">
                  Beat Name
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Location
              </h5>
              <div className="">
                <span className="text-md font-medium cursor-pointer dark:text-white">
                  Beat Lacation
                </span>
              </div>
            </div>
            <div className="flex justify-between flex-row">
              <h5 className="text-md font-bold text-gray-900 dark:text-white">
                Beat Guards
              </h5>
              <div className="">
                <span className="text-md font-medium cursor-pointer dark:text-white">
                  8
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BeatReport;
