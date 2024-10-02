import React, { useContext, useEffect, useState } from "react";
import flutterwave_seeklogo from "../../../images/flutterwave-seeklogo.svg";
import paystack_seeklogo from "../../../images/paystack-seeklogo.svg";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { usePaystackPayment } from "react-paystack";
import "./styles/Checkout.scss";

import { formatNumberWithCommas } from "../../../shared/functions/random-hex-color";
import { toast } from "react-toastify";
import useHttpRequest from "../../../shared/Hooks/HttpRequestHook";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import { useGetSubscriptionQuery } from "../../../redux/services/subscriptions";
import { selectSuspenseShow } from "../../../redux/selectors/suspense";
import {
  selectFwConfig,
  selectPlan,
  selectPsConfig,
} from "../../../redux/selectors/selectedPlan";
import { post } from "../../../lib/methods";
import { setOnboardingLevel } from "../../../redux/slice/onboardingSlice";

const PaymentOption = {
  FIRST: "flutterwave",
  SECOND: "paystack",
};

const Checkout = (props) => {
  const user = useSelector(selectUser);
  const psConfig = useSelector(selectPsConfig);
  const fwConfig = useSelector(selectFwConfig);
  const plan = useSelector(selectPlan);
  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);

  const { data: sub, refetch: refetchActiveSub } = useGetSubscriptionQuery(
    organization,
    {
      skip: token ? false : true,
    }
  );
  const suspenseState = useSelector(selectSuspenseShow);

  const dispatch = useDispatch();

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const navigate = useNavigate();

  useEffect(() => {
    if (plan && plan.amount) {
      setSelectedPlan(plan);
    }
  }, [plan]);

  const handleCheck = (e) => {
    setPaymentMethod(e);
  };

  const handlePaystackPayment = usePaystackPayment(psConfig);

  const handleFlutterPayment = useFlutterwave(fwConfig);

  const pay = async (e) => {
    e.preventDefault();

    if (paymentMethod === "flutterwave") {
      payWithFlutterwave();
    } else {
      payWithPaystack();
    }
  };

  const payWithFlutterwave = async () => {
    dispatch(suspenseShow());

    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          createSubscription(response);
        }
        closePaymentModal();
        dispatch(suspenseHide());
      },
      onClose: () => {
        toast.warn("Payment Window Closed, Payment Cancelled");
        dispatch(suspenseHide());
      },
    });
  };

  const payWithPaystack = async () => {
    dispatch(suspenseShow());
    handlePaystackPayment({
      onSuccess: (response) => {
        createSubscription(response);
      },
      onClose: () => {
        toast.warn("Payment Window Closed, Payment Cancelled");
        dispatch(suspenseHide());
      },
    });
  };

  const createSubscription = async (response) => {
    try {
      const reqData = {
        response: response,
        plan: selectedPlan,
        paymentgateway: paymentMethod,
      };

      const data = await post(`users/subscribe/${user.userid}`, reqData, token);

      if (data.message === "subscribed") {
        dispatch(suspenseHide());
        navigate("/onboarding/membership/successful");
        // dispatch(setOnboardingLevel(1));
      }
      refetchActiveSub();
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div className="">
      {/* checkout-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">Payment</h1>
      <p className="text-sm text-center mx-auto max-w-[430px] text-dark-400">
        Your subscription provides access to advanced security software designed
        to help you efficiently manage your security personnel.
      </p>

      <div
        className={
          (props.marginY ? `${props.marginY} ` : "my-16 ") +
          `mx-auto max-w-[500px]`
        }
      >
        <form method="post" onSubmit={pay}>
          <fieldset className="flex flex-col gap-4 mb-4">
            <legend className="mb-4 font-semibold text-xl">
              Select Payment Method
            </legend>
            <ul className="payment-options | flex flex-col gap-4">
              <li onClick={() => handleCheck(PaymentOption.FIRST)}>
                <input
                  type="radio"
                  name="payment_option"
                  id="flutterwave"
                  value={paymentMethod}
                />
                <label htmlFor="flutterwave" className="cursor-pointer block">
                  {/* Flutterwave */}
                  <div className="max-w-32" aria-label="Flutterwave">
                    <img src={flutterwave_seeklogo} alt="flutterwave" />
                  </div>
                </label>
              </li>

              <li onClick={() => handleCheck(PaymentOption.SECOND)}>
                <input
                  type="radio"
                  name="payment_option"
                  id="paystack"
                  value={paymentMethod}
                />
                <label htmlFor="paystack" className="cursor-pointer block">
                  {/* Paystack */}
                  <div className="max-w-32" aria-label="Paystack">
                    <img src={paystack_seeklogo} alt="paystack" />
                  </div>
                </label>
              </li>
            </ul>
          </fieldset>

          <RegularButton
            text={`Pay ₦${
              selectedPlan ? formatNumberWithCommas(selectedPlan.amount) : 0
            } Now`}
            backgroundColor="#FB9129"
          />
        </form>
      </div>
    </div>
  );
};

export default Checkout;
