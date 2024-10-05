import React, { useContext, useEffect, useState } from "react";
import flutterwave_seeklogo from "../../../images/flutterwave-seeklogo.svg";
import paystack_seeklogo from "../../../images/paystack-seeklogo.svg";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { usePaystackPayment } from "react-paystack";
import "./styles/Checkout.scss";
import Swal from "sweetalert2";

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
import {
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../../redux/services/subscriptions";
import { selectSuspenseShow } from "../../../redux/selectors/suspense";
import {
  selectFwConfig,
  selectPlan,
  selectPsConfig,
} from "../../../redux/selectors/onboarding";
import { post } from "../../../lib/methods";
import { setOnboardingLevel } from "../../../redux/slice/onboardingSlice";
import { api } from "../../../redux/services/api";
import { useGetInvoicesQuery } from "../../../redux/services/invoice";
import { useGetUserQuery } from "../../../redux/services/user";
import { debounceFunc } from "../../../utils/assetHelper";

const PaymentOption = {
  FIRST: "flutterwave",
  SECOND: "paystack",
};

const Checkout = (props) => {
  const user = useSelector(selectUser);
  const psConfig = useSelector(selectPsConfig);
  const fwConfig = useSelector(selectFwConfig);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref"); // For Paystack
  const transaction_id = queryParams.get("transaction_id"); // For Paystack
  const reference = queryParams.get("reference"); // For Paystack
  const paymentGateway = queryParams.get("paymentGateway");

  const plan = useSelector(selectPlan);
  const token = useSelector(selectToken);
  const organization = useSelector(selectOrganization);
  const { data: userData, refetch: refetchUserData } = useGetUserQuery(
    user._id,
    {
      skip: user?._id ? false : true,
    }
  );

  const { data: sub, refetch: refetchActiveSub } = useGetSubscriptionQuery(
    organization,
    {
      skip: token ? false : true,
    }
  );
  const suspenseState = useSelector(selectSuspenseShow);

  const { refetch: refetchAllMySubscriptions, ...allSubApiDetails } =
    useGetAllMySubscriptionsQuery(organization, {
      skip: !organization,
    });

  const { refetch: refetchInvoices, ...invoicesApiDetails } =
    useGetInvoicesQuery(
      { organization: organization, page: 1, limit: 10 },
      {
        skip: organization ? false : true,
      }
    );
  const dispatch = useDispatch();

  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      dispatch(suspenseShow());

      const response = await post("/subscriptions/verify-payment", {
        tx_ref,
        reference,
        transaction_id,
      });

      dispatch(api.util.invalidateTags([{ type: "Invoices" }]));
      dispatch(api.util.invalidateTags([{ type: "Subscription" }]));
      dispatch(api.util.invalidateTags([{ type: "Subscriptions" }]));
      dispatch(api.util.invalidateTags([{ type: "UserSubscriptions" }]));
      await refetchUserData();
      await refetchInvoices();
      await refetchAllMySubscriptions();
      await refetchActiveSub();

      if (response.status === "success") {
        // Update UI to show success message
        Swal.fire({
          title: "Payment Successful!",
          text: "Your subscription has been updated.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#008080",
        }).then(async () => {
          navigate("/onboarding/membership/successful");
        });
      } else {
        // Handle payment failure
        Swal.fire({
          title: "Payment Failed!",
          text: "Something went wrong with the payment. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
          confirmButtonColor: "#008080",
        }).then(() => {
          // Redirect back to subscription page

          navigate("/onboarding/membership/checkout");
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      Swal.fire({
        title: "Error!",
        text: "Unable to verify payment. Please contact support.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#008080",
      }).then(() => {
        navigate("/onboarding/membership/checkout");
      });
    } finally {
      dispatch(suspenseHide());
    }
  };

  const verifyPaymentDebounced = debounceFunc(verifyPayment, 1000);

  useEffect(() => {
    if (tx_ref || reference) {
      verifyPaymentDebounced();
    }
  }, [tx_ref, reference]);

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
    dispatch(suspenseShow());
    e.preventDefault();

    await createSubscription();
    // if (paymentMethod === "flutterwave") {
    //   payWithFlutterwave();
    // } else {
    //   payWithPaystack();
    // }
  };

  // const payWithFlutterwave = async () => {
  //   dispatch(suspenseShow());

  //   handleFlutterPayment({
  //     callback: (response) => {
  //       if (response.status === "successful") {
  //         createSubscription(response);
  //       }
  //       closePaymentModal();
  //       dispatch(suspenseHide());
  //     },
  //     onClose: () => {
  //       toast.warn("Payment Window Closed, Payment Cancelled");
  //       dispatch(suspenseHide());
  //     },
  //   });
  // };

  // const payWithPaystack = async () => {
  //   dispatch(suspenseShow());
  //   handlePaystackPayment({
  //     onSuccess: (response) => {
  //       createSubscription(response);
  //     },
  //     onClose: () => {
  //       toast.warn("Payment Window Closed, Payment Cancelled");
  //       dispatch(suspenseHide());
  //     },
  //   });
  // };

  const createSubscription = async () => {
    try {
      const reqData = {
        // response: response,
        plan: selectedPlan,
        paymentgateway: paymentMethod,
      };

      const data = await post(
        `subscriptions/onboarding/create/${user.userid}`,
        reqData,
        token
      );
      const { paymentUrl } = data;
      window.location.href = paymentUrl;

      // if (data) {
      //   dispatch(suspenseHide());
      //   navigate("/onboarding/membership/successful");
      //   // dispatch(setOnboardingLevel(1));
      // }
      // refetchActiveSub();
    } catch (error) {
    } finally {
      // dispatch(suspenseHide());
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
