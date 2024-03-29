import React from "react";
import { Link } from "react-router-dom";
import "./OnboardGuard.scss";

const OnboardGuard = () => {
  return (
    <div id="onboard-guard">
      {/* onboard-guard-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Onboard guard
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        This is just a subtext to support the topic above
      </p>

      <div className="mt-8"></div>

      <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form>
          {/*  */}

          {/*  */}
          <div className="mb-6">
            <label
              htmlFor="full_name"
              className="block mb-2 font-medium text-gray-900 dark:text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              autoComplete="full_name"
              required
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="phone_number"
                className="block font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-primary-500 font-medium"
              >
                I forgot my password
              </Link>
            </div>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
          </div>
          <div className="flex flex-wrap">
            <div>
              <button
                type="submit"
                class="text-white bg-primary-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Save
              </button>
            </div>
            {/* static tooltip */}
            <div className="relative bg-secondary-500 text-white inline-flex flex-col rounded-lg p-4 max-w-sm text-xs sm:text-sm">
              <div class="tip absolute top-4 -left-2"></div>
              <p>
                When you click on “save” a message will be sent to the guard to
                finish the onboading
              </p>
              <p>Got it</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardGuard;
