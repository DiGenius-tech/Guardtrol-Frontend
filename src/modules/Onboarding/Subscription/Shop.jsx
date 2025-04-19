import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";

import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { formatNumberWithCommas } from "../../../shared/functions/random-hex-color";
import { SubscriptionContext } from "../../../shared/Context/SubscriptionContext";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  selectToken,
  selectUser,
  selectOrganization,
} from "../../../redux/selectors/auth";
import {
  selectFwConfig,
  selectOnboarding,
  selectOnboardingLevel,
  selectPsConfig,
} from "../../../redux/selectors/onboarding";
import { setOnboardingLevel } from "../../../redux/slice/onboardingSlice";
import {
  setFwConfig,
  setPlan,
  setPsConfig,
} from "../../../redux/slice/onboardingSlice";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";
import { useCurrency } from "../../../constants/static";
import { useGetUserOrganizationRoleQuery } from "../../../redux/services/role";

const Shop = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const psConfig = useSelector(selectPsConfig);
  const fwConfig = useSelector(selectFwConfig);
  const { getBeatPrice, getGuardPrice, getCurrencyCode, currency } = useCurrency();
  const organization = useSelector(selectOrganization);

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });
  const USED_BEAT_PRICE = userRole?.organization?.BEAT_PRICE || getBeatPrice();
  const USED_GUARD_PRICE = userRole?.organization?.GUARD_PRICE || getGuardPrice();

  const [validationErrors, setValidationErrors] = useState({});
  const { error, responseData, sendRequest } = useHttpRequest();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    numberofbeats: 1,
    extraguards: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State variable to control modal visibility
  const [isLoading, setisLoading] = useState(false); // State variable to control modal visibility


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanFormData((prev) => ({
      ...prev,
      [name]: value, // Update the field dynamically
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" })); // Clear validation error
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setPlanFormData((prev) => ({
      ...prev,
      [name]: value === "" ? (name === "numberofbeats" ? 1 : 0) : value, // Reset default value if empty
    }));
  };

  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors = {};

    for (const el of form.elements) {
      if (el.nodeName === "INPUT" && !el.validity.valid) {
        newErrors[el.name] = el.validationMessage;
      }

      if (el.name === "numberofbeats" && el.value < 1) {
        newErrors["numberofbeats"] = "Can't Have Less Than 1 Beat";
      } else if (el.name === "numberofbeats" && el.value > 10) {
        newErrors["numberofbeats"] = "Can't Have More Than 10 Beats";
      }

      if (el.name === "extraguards" && el.value < 0) {
        newErrors["extraguards"] = "Can't Have Less Than 0 Extra Guards";
      } else if (el.name === "extraguards" && el.value > 10) {
        newErrors["extraguards"] = "Can't Have More Than 10 Extra Guards";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      e.stopPropagation();
    } else {
      if (null == selectedPlan) {
        toast.error("Please Select A Plan That Works For You");
        return;
      }
      setSelectedPlan();

      dispatch(
        setPsConfig({
          ...{
            ...psConfig,
            numberofbeats: planFormData.numberofbeats,
            extraguards: planFormData.extraguards,
            ...(selectedPlan.type === "yearly"
              ? {
                amount:
                  (selectedPlan.numberofbeats * USED_BEAT_PRICE +
                    selectedPlan.extraguards * USED_GUARD_PRICE) *
                  12 *
                  0.8,
              }
              : {
                amount:
                  selectedPlan.numberofbeats * USED_BEAT_PRICE +
                  selectedPlan.extraguards * USED_GUARD_PRICE,
              }),
            currency: currency,
          },
          ...user,
        })
      );
      dispatch(
        setFwConfig({
          ...{
            ...fwConfig,
            numberofbeats: planFormData.numberofbeats,
            extraguards: planFormData.extraguards,
            ...(selectedPlan.type === "yearly"
              ? {
                amount:
                  (selectedPlan.numberofbeats * USED_BEAT_PRICE +
                    selectedPlan.extraguards * USED_GUARD_PRICE) *
                  12 *
                  0.8,
              }
              : {
                amount:
                  selectedPlan.numberofbeats * USED_BEAT_PRICE +
                  selectedPlan.extraguards * USED_GUARD_PRICE,
              }),
            currency: currency,
          },
          ...user,
        })
      );
      dispatch(setPlan(selectedPlan));

      navigate("/onboarding/membership/checkout");
    }

    setisLoading(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const membership_card_data = [
    {
      title: `${getCurrencyCode()}${formatNumberWithCommas(
        planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE
      )}`,
      body_list: [
        `${getCurrencyCode()}${formatNumberWithCommas(
          planFormData.numberofbeats * USED_BEAT_PRICE
        )} per month`,
        `${planFormData.extraguards} Extra Guard(s) x ${getCurrencyCode()}${formatNumberWithCommas(USED_GUARD_PRICE)}`,
      ],
      footer: "Lets Get you started with the Basic Plan",
      type: "monthly",
      amount:
        planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE,
      readable: `${getCurrencyCode()}${formatNumberWithCommas(
        planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE
      )} per month`,
      numberofbeats: parseInt(planFormData.numberofbeats),
      extraguards: parseInt(planFormData.extraguards),
    },
    {
      title: `${getCurrencyCode()}${formatNumberWithCommas(
        (planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE) *
        12 *
        0.8
      )}`,
      body_list: [
        `${getCurrencyCode()}${formatNumberWithCommas(
          (planFormData.numberofbeats * USED_BEAT_PRICE * 12 * 0.8).toFixed(2)
        )} per year`,
        `${planFormData.extraguards} Extra Guard(s) x ${getCurrencyCode()}${formatNumberWithCommas((USED_GUARD_PRICE * 12 * 0.8).toFixed(2))}`,
      ],
      footer: "20% Discount when you select this Plan",
      type: "yearly",
      amount:
        (planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE) *
        12 *
        0.8,
      readable: `${getCurrencyCode()}${formatNumberWithCommas(
        (planFormData.numberofbeats * USED_BEAT_PRICE + planFormData.extraguards * USED_GUARD_PRICE) *
        12 *
        0.8
      )} per year`,
      numberofbeats: parseInt(planFormData.numberofbeats),
      extraguards: parseInt(planFormData.extraguards),
    },
  ];

  const onSelectPlan = (e) => {
    console.log(e.target.value);
    setSelectedPlan(JSON.parse(e.target.value));
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalButtonClick = () => { };

  return (
    <>
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Membership
      </h1>
      <p className="text-sm text-center mx-auto max-w-[430px] text-dark-400">
        Your subscription provides access to advanced security software designed
        to help you efficiently manage your security personnel.
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
              id="numberofbeats"
              muted_aside_text="Maximum of 5 Guard(s) per Beat"
              name="numberofbeats"
              type="number"
              value={planFormData.numberofbeats}
              onChange={handleChange}
              onBlur={handleBlur} // Ensure default value on blur
              min={1}
              max={10}
              error={validationErrors.numberofbeats}
            />
          </div>
          <div className="mb-6">
            <TextInputField
              label="How many Extra Guard(s)?"
              type="number"
              name="extraguards"
              value={planFormData.extraguards}
              onChange={handleChange}
              onBlur={handleBlur} // Ensure default value on blur
              min={0}
              max={10}
              error={validationErrors.extraguards}
            />
          </div>
          <div className="mb-6">
            <fieldset>
              <legend className="block mb-2 font-semibold dark:text-white">
                Select a plan that works for you
              </legend>

              <ul className="flex justify-center flex-row items-center flex-wrap gap-2">
                {membership_card_data.map((data, index) => {
                  const isMonthly = index === 0; // Assuming the first card is for monthly
                  const isYearly = index === 1;  // Assuming the second card is for yearly

                  return (
                    <li
                      key={data.type}
                      className="max-w-[250px] w-[48%] min-w-[200px]"
                    >
                      <input
                        type="radio"
                        name="plan-option"
                        id={data.type}
                        value={JSON.stringify(data)}
                        onChange={(e) => onSelectPlan(e)}
                      />
                      <label htmlFor={data.type}>
                        <span
                          className="plan-option-card | cursor-pointer flex flex-col items-center max-w-sm p-4 sm:p-6 rounded-lg shadow dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
                        >
                          {/* Header */}
                          <h3 className="text-lg font-bold mb-4">
                            {isMonthly && "Monthly Plan"}
                            {isYearly && "Yearly Plan"}
                          </h3>

                          {/* Original Price */}

                          {isYearly && <div className="mb-4">
                            <span
                              className="text-grey-500 text-xxl font-normal line-through mr-2 decoration-grey decoration-5"
                            >
                              {`${getCurrencyCode()}${formatNumberWithCommas(data.amount / 0.8)}`}
                            </span>
                          </div>}
                          {/* Breaklines for design purpose if it is a monthly plan, if not it will shouw the original price slashed*/}
                          {isMonthly && <div className="mb-4">
                            <span className="text-red-500 text-xl font-semibold line-through mr-2">
                            </span>
                            <span className="text-green-500 text-2xl font-bold">
                            </span>
                          </div>}


                          {/* Card Content */}
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

                          {/* Footer */}
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
            disabled={isLoading}
            isLoading={isLoading}
            text={
              "Continue to Pay " +
              getCurrencyCode() +
              (selectedPlan
                ? `${formatNumberWithCommas(
                  membership_card_data.find((data) => data.type === selectedPlan.type)?.amount || 0
                )}`
                : "0")
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
                {/* <FlutterWaveButton {...fwConfig} /> */}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;