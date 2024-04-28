import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";

import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { formatNumberWithCommas } from "../../../../../shared/functions/random-hex-color";
import { SubscriptionContext } from "../../../../../shared/Context/SubscriptionContext";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  selectToken,
  selectUser,
} from "../../../../../redux/selectors/auth";
import {
  selectOnboarding,
  selectOnboardingLevel,
} from "../../../../../redux/selectors/onboarding";
import { setOnboardingLevel } from "../../../../../redux/slice/onboardingSlice";
import {
  setFwConfig,
  setPlan,
  setPsConfig,
} from "../../../../../redux/slice/selectedPlanSlice";

const Shop = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const onBoardingLevel = useSelector(selectOnboardingLevel);
  const token = useSelector(selectToken);

  const [validationErrors, setValidationErrors] = useState({});
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    numberofbeats: 1,
    extraguards: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State variable to control modal visibility

  useEffect(() => {
    if (token) {
      const data = sendRequest(`users/getuser/${user.userid}`, "GET", null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }).then((response) => {
        if (response?.subscriptions.length > 0) {
          dispatch(setOnboardingLevel(1));

          if (response.beats.length > 0) {
            dispatch(setOnboardingLevel(2));
            if (response.guards.length > 0) {
              dispatch(setOnboardingLevel(3));
              if (response.beats.some((beat) => beat.guards.length > 0)) {
                dispatch(setOnboardingLevel(4));
              }
            }
          }
        }
      });
    }
  }, [token]);

  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem("selectedPlan"));

    if (plan && plan.amount) {
      setSelectedPlan(plan);
      setPlanFormData({
        numberofbeats: plan.numberofbeats,
        extraguards: plan.extraguards,
      });
    }
  }, [setSelectedPlan, setPlanFormData]);

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
        console.log(el.name);
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
      // If there are validation errors, update state and stop submission
      setValidationErrors(newErrors);
      e.stopPropagation();
    } else {
      if (null == selectedPlan) {
        toast.error("Please Select A Plan That Works For You");
        return;
      }
      selectedPlan.numberofbeats = planFormData.numberofbeats;
      selectedPlan.extraguards = planFormData.extraguards;
      selectedPlan.amount =
        selectedPlan.numberofbeats * 10000 + selectedPlan.extraguards * 2000;
      if (selectedPlan.type === "yearly") {
        selectedPlan.amount =
          (selectedPlan.numberofbeats * 10000 +
            selectedPlan.extraguards * 2000) *
          12 *
          0.8;
      }

      dispatch(setPsConfig({ ...selectedPlan, ...user }));
      dispatch(setFwConfig({ ...selectedPlan, ...user }));
      dispatch(setPlan(selectedPlan));

      navigate("/onboarding/membership/checkout");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const membership_card_data = [
    {
      title: `₦${formatNumberWithCommas(
        planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000
      )}`,
      body_list: [
        `₦${formatNumberWithCommas(
          planFormData.numberofbeats * 10000
        )} per month`,
        `${planFormData.extraguards} Extra Guards x ₦2,000`,
      ],
      footer: "Lets Get you started with the Basic Plan",
      type: "monthly",
      amount:
        planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000,
      readable: `₦${formatNumberWithCommas(
        planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000
      )} per month`,
      numberofbeats: parseInt(planFormData.numberofbeats),
      extraguards: parseInt(planFormData.extraguards),
    },
    {
      title: `₦${formatNumberWithCommas(
        (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
          12 *
          0.8
      )}`,
      body_list: [
        `₦${formatNumberWithCommas(
          planFormData.numberofbeats * 10000 * 12 * 0.8
        )} per year`,
        `${planFormData.extraguards} Extra Guards x ₦20,000`,
      ],
      footer: "20% Discount when you select this Plan",
      type: "yearly",
      amount:
        (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
        12 *
        0.8,
      readable: `₦${formatNumberWithCommas(
        (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) *
          12 *
          0.8
      )} per year`,
      numberofbeats: parseInt(planFormData.numberofbeats),
      extraguards: parseInt(planFormData.extraguards),
    },
  ];

  const onSelectPlan = (e) => {
    localStorage.setItem("selectedPlan", e.target.value);
    setSelectedPlan(JSON.parse(e.target.value));
    console.log(selectedPlan);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle button click in the modal
  const handleModalButtonClick = () => {
    // Add your logic here for the button click inside the modal
    console.log("Modal button clicked");
  };

  // const fwConfig = {
  //   ...config,
  //   text: "Pay with Flutterwave!",
  //   callback: (response) => {
  //     console.log(response);
  //     closePaymentModal(); // this will close the modal programmatically
  //   },
  //   onClose: () => {},
  // };

  return (
    <>
      <h1 className="font-bold text-center text-2xl text-dark-450">
        Membership
      </h1>
      <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
        The subscription goes towards getting access to the security software to
        help manage your security personnel
      </p>

      <div className="mx-auto max-w-[500px] my-16">
        <form onSubmit={handleSubmit} method="post">
          <div className="mb-6">
            <TextInputField
              label="How many beats?"
              semibold_label={true}
              type="number"
              id="numberofbeats"
              required="required"
              muted_aside_text="Maximum of 5 guard per beat"
              name="numberofbeats"
              value={planFormData.numberofbeats}
              onChange={handleChange}
              error={validationErrors["numberofbeats"]}
            />
          </div>
          <div className="mb-6">
            <TextInputField
              label="How many extra guard?"
              placeholder="₦2,000 per guard"
              semibold_label={true}
              type="number"
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

              <ul className="grid grid-cols-2 gap-2">
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
              "Continue To Pay ₦" +
              (selectedPlan
                ? `${formatNumberWithCommas(
                    membership_card_data.filter((data) => {
                      return data.type == selectedPlan.type;
                    })[0].amount
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
