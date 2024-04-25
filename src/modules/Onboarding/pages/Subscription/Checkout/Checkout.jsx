import React, { useContext, useEffect, useState } from "react";
import flutterwave_seeklogo from "../../../../../images/flutterwave-seeklogo.svg";
import paystack_seeklogo from "../../../../../images/paystack-seeklogo.svg";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { usePaystackPayment } from "react-paystack";
import "./Checkout.scss";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { formatNumberWithCommas } from "../../../../../shared/functions/random-hex-color";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { SubscriptionContext } from "../../../../../shared/Context/SubscriptionContext";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";
import { useGetSubscriptionQuery } from "../../../../../redux/services/subscriptions";
import { selectSuspenseShow } from "../../../../../redux/selectors/suspense";
import { setCurrentSubscription } from "../../../../../redux/slice/subscriptionSlice";

const PaymentOption = {
  FIRST: "flutterwave",
  SECOND: "paystack",
};

const Checkout = () => {
  const user = useSelector(selectUser);
  //   const sub = useContext(SubscriptionContext);

  const { data: sub } = useGetSubscriptionQuery(user.userid);
  const suspenseState = useSelector(selectSuspenseShow);

  const dispatch = useDispatch();
  //   dispatch(suspenseHide());
  //   dispatch(suspenseShow());

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

    if (selectedPlan && selectedPlan.amount) {
      setSelectedPlan(selectedPlan);
    }

    dispatch(suspenseHide());
  }, [suspenseState, setSelectedPlan]);
  const handleCheck = (e) => {
    setPaymentMethod(e);
  };

  const psConfig = {
    email: user.email,
    amount: parseInt(selectedPlan?.amount) * 100,
    metadata: {
      name: user.name,
      phone: user.phone || null,
    },
    publicKey: process.env.REACT_APP_PAYSTACK_KEY,
  };
  const handlePaystackPayment = usePaystackPayment(psConfig);
  const fwConfig = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
    tx_ref: Date.now(),
    amount: parseInt(selectedPlan?.amount),
    currency: "NGN",
    payment_options: "all",
    payment_plan: selectedPlan?.type,
    customer: {
      email: user.email,
      phone_number: user.phone || null,
      name: user.name,
    },
    meta: { counsumer_id: user.userid, consumer_mac: user.clientid },
    customizations: {
      title: "Guardtrol Lite Subscription",
      description: `${selectedPlan?.type} subscription to guardtrol lite`,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
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
          console.log(response);
          createSubscription(response);
        }
        closePaymentModal();
        //dispatch(suspenseHide())
      },
      onClose: () => {
        toast.warn("Payment Window Closed, Payment Cancelled");
        dispatch(suspenseHide());
      },
    });

    // localStorage.setItem('onBoardingLevel', 1) //this should be after a successful payment
    // navigate("/onboarding/configure-beats")
    // window.location.reload()
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
      dispatch(suspenseShow());
      const data = await sendRequest(
        `users/subscribe/${user.userid}`,
        "POST",
        JSON.stringify(reqData),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      );
      console.log(1);
      if (data && data.message === "subscribed") {
        console.log(2);

        localStorage.removeItem("selectedPlan");
        localStorage.setItem("paymentComplete", true);
        localStorage.setItem("onBoardingLevel", 1);
        dispatch(setCurrentSubscription(data.subscription));
        console.log("first");
        navigate("/onboarding/membership/successful");
        window.location.reload();
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div>
      {/* checkout-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">Payment</h1>
      <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
        The subscription goes towards getting access to the security software to
        help manage your security personel
      </p>
      <div className="mx-auto max-w-[500px] my-16">
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
                  checked
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
