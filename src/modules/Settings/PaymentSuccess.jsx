import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../redux/services/api"; // Your redux API services
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import Swal from "sweetalert2";
import { post } from "../../lib/methods";
import {
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../redux/services/subscriptions";
import { selectOrganization } from "../../redux/selectors/auth";
import { useGetInvoicesQuery } from "../../redux/services/invoice";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Prevent double verification
  const organization = useSelector(selectOrganization);

  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref"); // For Paystack
  const transaction_id = queryParams.get("transaction_id"); // For Paystack
  const reference = queryParams.get("reference"); // For Paystack
  const paymentGateway = queryParams.get("paymentGateway");

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
    if (isVerified) return; // Prevent double verification
    setIsVerified(true); // Mark as verified

    try {
      dispatch(suspenseShow());

      // Verify payment with your backend
      const response = await post("/webhook/verify-payment", {
        tx_ref,
        reference,
        transaction_id,
      });

      if (response.status === "success") {
        // Update UI to show success message
        Swal.fire({
          title: "Payment Successful!",
          text: "Your subscription has been updated.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#008080",
        }).then(async () => {
          dispatch(api.util.invalidateTags([{ type: "Invoices" }]));
          dispatch(api.util.invalidateTags([{ type: "Subscription" }]));
          dispatch(api.util.invalidateTags([{ type: "Subscriptions" }]));
          dispatch(api.util.invalidateTags([{ type: "UserSubscriptions" }]));

          if (invoicesApiDetails.isUninitialized) {
            await refetchInvoices();
          }

          if (allSubApiDetails.isUninitialized) {
            await refetchAllMySubscriptions();
          }

          if (activeSubApiDetails.isUninitialized) {
            await refetchActiveSubscription();
          }
          navigate("/dashboard");
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
          navigate("/subscription");
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
        navigate("/dashboard");
      });
    } finally {
      dispatch(suspenseHide());
      setIsLoading(false);
    }
  };
  const verifyPaymentDebounced = debounce(verifyPayment, 1000);

  useEffect(() => {
    if (tx_ref || reference) {
      verifyPaymentDebounced();
    }
  }, [tx_ref, reference]);

  return (
    <div className="payment-success-page">
      {isLoading ? (
        <div className="loader">Processing payment...</div>
      ) : (
        <div className="message">Redirecting...</div>
      )}
    </div>
  );
};

export default PaymentSuccess;
