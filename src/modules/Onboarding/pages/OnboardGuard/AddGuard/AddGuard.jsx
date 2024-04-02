import { useState } from "react";
import { Link } from "react-router-dom";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";

function AddGuard() {
  const [isGotIt, setIsGotIt] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: ""
  });

  const handle_is_got_it = () => {
    setIsGotIt(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };
  return (
    <>
      {/* add-guard-app works! */}

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form>
          {/*  */}

          {/*  */}
          <div className="mb-6">
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
            <TextInputField
              label="Phone Number"
              name="phone"
              type="number"
              placeholder="Phone Number"
              id="phone"
              error={validationErrors["phone"]}
              onChange={handleChange}
              required="required"
              value={formData.phone}
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
