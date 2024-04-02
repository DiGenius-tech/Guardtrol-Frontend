import React from "react";
import { Link } from "react-router-dom";

const AssignBeats = () => {
  return (
    <>
      {/* assign-beats-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Assign Beats
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        This is just a subtext to support the topic above
      </p>

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-16">
        <form>
          {/*  */}
          <div className="mb-6">
            <label
              htmlFor="beat"
              className="block mb-2 font-medium text-gray-900 dark:text-white"
            >
              Select beat
            </label>
                <select name="" id=""></select>
          </div>
          
          <div>
            <button
              type="submit"
              className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <span className="text-base sm:text-lg">Finish Onboarding</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AssignBeats;
