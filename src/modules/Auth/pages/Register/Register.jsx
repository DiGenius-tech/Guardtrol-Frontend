import React from "react";
import { Link } from "react-router-dom";
import googleIconImg from "../../../../images/icons/google-social-icon.svg";
import left_pattern_boxes from "../../../../images/left-pattern-boxes.svg";
import right_pattern_boxes from "../../../../images/right-pattern-boxes.svg";

const Register = () => {
  return (
    <>
      {/* register-app works! */}

      <div className="min-h-80 mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 sm:gap-8 mx-auto px-2 sm:px-6 lg:px-8">
          <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-left">
            <div className="h-48"></div>
            <div className="h-full flex items-end justify-end">
              <img src={left_pattern_boxes} alt="" />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="mt-16"></div>
            <h1 className="font-bold text-2xl tracking-wide text-center">
              Create an Account
            </h1>

            <div className="mt-8"></div>

            <div className="block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <form>
                <div className="mb-6">
                  <label
                    htmlFor="full_name"
                    className="block mb-2 font-medium dark:text-white"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium dark:text-white"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="phone_number"
                    className="block mb-2 font-medium dark:text-white"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    required
                  />
                </div>
                <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 font-medium dark:text-white"
                    >
                      Password
                    </label>
                  <input
                    type="password"
                    id="password"
                    className="border border-gray-300 text-sm rounded-[10px] focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  <span className="text-base sm:text-lg">Create An Account</span>
                </button>
              </form>
            </div>

            <p className="horizontal-line-title fw-medium my-8 text-center">
              Or you can
            </p>

            <Link
              to=""
              className="mb-4 block w-full border border-primary-500 text-dark bg-white focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <span className="sm:text-lg flex items-center justify-center gap-2">
                <img src={googleIconImg} alt="Sign Up With Google" />
                Sign Up With Google
              </span>
            </Link>
          </div>
          <div className="hidden sm:block sm:col-span-2 lg:col-span-4 text-right">
            <div className="h-48 hidden lg:block"></div>
            <div className="h-full flex items-end justify-end">
              <img src={right_pattern_boxes} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
