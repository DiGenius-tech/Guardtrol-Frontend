import { useState } from "react";
import { Link } from "react-router-dom";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";

function UpdateGuard({ selectedGuard }) {
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  console.log(selectedGuard);

  const set_name = (e) => {
    console.log(e.target.value);
  };
  const set_number = (e) => {
    console.log(e.target.value);
  };
  return (
    <>
      {/* update-guard-app works! */}

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
              value={selectedGuard.name}
              onChange={set_name}
            />
            <TextInputField
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="Full Name"
              id="full_name"
              error={validationErrors["full_name"]}
              onChange={handleChange}
              required="required"
              value={formData.phone}
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
            </div>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
              value={selectedGuard.phone_number}
              onChange={set_number}
            />
          </div>
          <div className="">
            <div className="relative">
              <button
                type="submit"
                className="text-white bg-primary-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateGuard;
