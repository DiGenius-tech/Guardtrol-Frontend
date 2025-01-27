import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../Sandbox/InputField/TextInputField";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../shared/Hooks/HttpRequestHook";
import { useNavigate } from "react-router-dom";

import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors/auth";
import { suspenseHide } from "../../redux/slice/suspenseSlice";
import { selectSuspenseShow } from "../../redux/selectors/suspense";
import { setOnboardingLevel } from "../../redux/slice/onboardingSlice";

const Membership = () => {
  const auth = useSelector(selectUser);
  const dispatch = useDispatch();

  const suspenseState = useSelector(selectSuspenseShow);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    numberofbeats: 1,
    extraguards: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State variable to control modal visibility

  useEffect(() => {
    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

    if (selectedPlan && selectedPlan.amount) {
      setSelectedPlan(selectedPlan);
      setPlanFormData({
        numberofbeats: parseInt(selectedPlan.numberofbeats),
        extraguards: parseInt(selectedPlan.extraguards),
      });
    }

    dispatch(suspenseHide());
  }, [suspenseState, setSelectedPlan, setPlanFormData]);

  const handleChange = (e) => {
    setPlanFormData({ ...planFormData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors = {};

    // Check each input field's validity and set errors accordingly
    for (const el of form.elements) {
      if (el.nodeName === "INPUT" && !el.validity.valid) {
        newErrors[el.name] = el.validationMessage;
      }

      if (el.name === "numberofbeats" && el.value < 1) {
        newErrors["numberofbeats"] = "Can't Have Less Than 1 Beat";
      } else if (el.name === "numberofbeats" && el.value > 10) {
        newErrors["numberofbeats"] = "Can't Have More Than 10 Beats";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      // If there are validation errors, update state and stop submission
      setValidationErrors(newErrors);
      e.stopPropagation();
    } else {
      if (null == selectedPlan) {
        toast.error("Please Select A Plan That Works For You");
        return;
      }

      localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));

      dispatch(setOnboardingLevel(1));
      navigate("/onboarding/configure-beats");
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const membership_card_data = [
    {
      title: `₦${planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000
        }`,
      body_list: [
        `₦${planFormData.numberofbeats * 10000} P/M`,
        `${planFormData.extraguards} Extraguards x ₦2000`,
      ],
      footer: "This should just give a summary of the benefits",
      type: "monthly",
      amount:
        planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000,
      readable: `₦${planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000
        } per month`,
      numberofbeats: planFormData.numberofbeats,
      extraguards: planFormData.extraguards,
    },
    {
      title: `₦${(planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
        12 *
        0.8
        }`,
      body_list: [
        `₦${planFormData.numberofbeats * 10000 * 12 * 0.8} P/Y`,
        `${planFormData.extraguards} Extraguards x ₦20000`,
      ],
      footer: "This should just give a summary of the benefits",
      type: "yearly",
      amount:
        (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
        12 *
        0.8,
      readable: `₦${(planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
        12 *
        0.8
        } per year`,
      numberofbeats: planFormData.numberofbeats,
      extraguards: planFormData.extraguards,
    },
  ];

  const onSelectPlan = (e) => {
    setSelectedPlan(JSON.parse(e.target.value));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalButtonClick = () => { };

  const config = {
    public_key: "FLWPUBK-a1be03107079ab0523984695c59cbbed-X",
    tx_ref: Date.now(),
    amount: selectedPlan && selectedPlan.amount ? selectedPlan.amount : 0,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: auth.email,
      phone_number: auth.phone,
      name: auth.name,
    },
    customizations: {
      title: "Alphatrol",
      description: "Guardtrol Subscription",
      logo: "https://alphatrol.com/wp-content/uploads/2022/09/alphatrol-logo-black.png",
    },
  };

  const fwConfig = {
    ...config,
    text: "Pay with Flutterwave!",
    callback: (response) => {
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => { },
  };

  return (
    <>
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Membership
      </h1>
      <p className="text-sm text-center mx-auto max-w-[430px] text-dark-400">
        The subscription goes towards getting access to the security software to
        help manage your security personnel
      </p>

      <div className="mx-auto max-w-[500px] my-16">
        <form onSubmit={handleSubmit} method="post">
          <div className="mb-6">
            <TextInputField
              label={
                <span>
                  How many Beat(s)?
                  {/* Tooltip Icon */}
                  <span className="ml-2 relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block text-gray-500 cursor-pointer hover:text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip Text */}
                    <span className="absolute left-0 bottom-6 w-48 bg-gray-700 text-white text-sm rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      A beat is a designated patrol area consisting of multiple patrol points where guards ensure security coverage.
                    </span>
                  </span>
                </span>
              }
              semibold_label={true}
              type="text"
              id="numberofbeats"
              required="required"
              muted_aside_text="Maximum of 5 Guard(s) per Beat"
              name="numberofbeats"
              value={planFormData.numberofbeats}
              onChange={handleChange}
              error={validationErrors["numberofbeats"]}
            />
          </div>
          <div className="mb-6">
            <TextInputField
              label="How many Extra Guard(s)?"
              placeholder="₦2,000 per Guard"
              semibold_label={true}
              type="text"
              id="number-of-extra-guard"
              required="required"
              placeholder_right={true}
              name="extraguards"
              value={planFormData.extraguards}
              onChange={handleChange}
              error={validationErrors["extraguards"]}
            />
          </div>
          <div className="mb-6">
            <fieldset>
              <legend className="block mb-2 font-semibold dark:text-white">
                Select a plan that works for you
              </legend>

              <ul className=" gap-2 flex flex-wrap">
                {membership_card_data.map((data) => {
                  return (
                    <li className="col-span-1" key={data.type}>
                      <input
                        type="radio"
                        name="plan-option"
                        id={data.type}
                        value={JSON.stringify(data)}
                        onChange={(e) => onSelectPlan(e)}
                      />
                      <label htmlFor={data.type}>
                        <span
                          className="plan-option-card | cursor-pointer flex flex-col items-center max-w-sm p-4 sm:p-6 rounded-lg shadow dark:bg-gray-800 dark:hover:bg-gray-700
                          text-white"
                        >
                          <div className="mb-10 sm:mb-12">
                            <h2 className="text-xl sm:text-4xl my-8 sm:my-10 font-semibold">
                              {data.title}
                            </h2>
                            <ul className="text-sm">
                              {data.body_list.map((bl, i) => {
                                return <li key={i}>{bl}</li>;
                              })}
                            </ul>
                          </div>
                          <span className="footer text-[#9BA2A7] text-center text-[9px] sm:text-[13px] font-semibold sm:font-normal">
                            {data.footer}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <RegularButton
            text={
              "Continue" + (selectedPlan ? ` (${selectedPlan.readable})` : "")
            }
          />
        </form>
      </div>

      {/* Render the modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md">
              <button
                className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                <svg
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 7.707 6.293a1 1 0 1 0-1.414 1.414L10.586 12l-4.293 4.293a1 1 0 1 0 1.414 1.414L12 13.414l4.293 4.293a1 1 0 1 0 1.414-1.414L13.414 12l4.293-4.293a1 1 0 0 0 0-1.414z" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-4">
                Select a payment option
              </h2>
              <div>
                {/* Display selected plan and other form data */}
                <p>Selected Plan: {selectedPlan?.title}</p>
                <p>Number of Beats: {planFormData.numberofbeats}</p>
                <p>Number of Extra Guards: {planFormData.extraguards}</p>
                {/* Add more summary details as needed */}
              </div>
              {/* Button inside the modal */}
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={handleModalButtonClick}
              >
                <FlutterWaveButton {...fwConfig} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Membership;
