import { useState } from "react";
import { Link } from "react-router-dom";

function AddGuard() {
  const [isGotIt, setIsGotIt] = useState(false);

  const handle_is_got_it = () => {
    setIsGotIt(true);
  };

  return (
    <>
      {/* add-guard-app works! */}

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
          </div>
          <div className="">
            <div className="relative">
              <button
                type="submit"
                className="text-white bg-primary-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Save
              </button>
              {/* static tooltip */}
              {!isGotIt ? (
                <div className="mt-2 sm:mt-0 absolute sm:top-0 sm:left-24 ms-2">
                  <div className="relative bg-secondary-500 text-white inline-flex flex-col rounded-lg p-4 max-w-sm">
                    <div className="hidden sm:block tip absolute top-4 -left-2"></div>
                    <div className="sm:hidden tip sm-scrn absolute -top-2 left-6"></div>
                    <p className="text-xs mb-4">
                      When you click on “save” a message will be sent to the
                      guard to finish the onboading
                    </p>
                    <button
                      className="underline inline-flex font-semibold text-xs"
                      onClick={handle_is_got_it}
                    >
                      Got it
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>
      <div className="mb-32"></div>
    </>
  );
}

export default AddGuard;
