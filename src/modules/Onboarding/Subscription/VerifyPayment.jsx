import React, { useEffect, useRef, useState } from "react";
import "./styles/PaymentSuccess.scss";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../../../redux/services/user";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import Swal from "sweetalert2";

import { Spinner } from "flowbite-react";
import {
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../../redux/services/subscriptions";
import { useGetInvoicesQuery } from "../../../redux/services/invoice";
import { selectOrganization, selectUser } from "../../../redux/selectors/auth";
import { api } from "../../../redux/services/api";
import { post } from "../../../lib/methods";
import { debounceFunc } from "../../../utils/assetHelper";

const VerifyPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const user = useSelector(selectUser);
  const organization = useSelector(selectOrganization);

  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref"); // For Paystack
  const transaction_id = queryParams.get("transaction_id"); // For Paystack
  const reference = queryParams.get("reference"); // For Paystack
  const paymentGateway = queryParams.get("paymentGateway");

  const { data: userData, refetch: refetchUserData } = useGetUserQuery(
    user._id,
    {
      skip: user?._id ? false : true,
    }
  );
  const { refetch: refetchActiveSubscription, ...activeSubApiDetails } =
    useGetSubscriptionQuery(organization, {
      skip: !organization,
    });

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
  const verifyPayment = async () => {
    setIsVerified(true); // Mark as verified

    try {
      dispatch(suspenseShow());

      // Verify payment with your backend
      const response = await post("/subscriptions/verify-payment", {
        tx_ref,
        reference,
        transaction_id,
      });

      dispatch(api.util.invalidateTags([{ type: "Invoices" }]));
      dispatch(api.util.invalidateTags([{ type: "Subscription" }]));
      dispatch(api.util.invalidateTags([{ type: "Subscriptions" }]));
      dispatch(api.util.invalidateTags([{ type: "UserSubscriptions" }]));

      if (response.status === "success") {
        // Update UI to show success message
        Swal.fire({
          title: "Payment Successful!",
          text: "Your subscription has been updated.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#008080",
        }).then(async () => {
          await refetchUserData();
          await refetchInvoices();
          await refetchAllMySubscriptions();
          await refetchActiveSubscription();

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
      setIsLoading(false);
    }
  };

  const verifyPaymentDebounced = debounceFunc(verifyPayment, 1000);

  useEffect(() => {
    if (tx_ref || reference) {
      verifyPaymentDebounced();
    }
  }, [tx_ref, reference]);

  return (
    <div className="payment-success-page">
      {isLoading ||
      activeSubApiDetails.isLoading ||
      invoicesApiDetails.isLoading ||
      allSubApiDetails.isLoading ? (
        <div className=" bg-white flex w-full h-full justify-center items-center">
          <Spinner size={"xl"} color="success" />
        </div>
      ) : (
        <div className="message">Redirecting...</div>
      )}
    </div>
  );
};

export default VerifyPayment;
