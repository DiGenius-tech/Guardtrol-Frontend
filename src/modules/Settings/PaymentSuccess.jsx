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
import { Spinner } from "flowbite-react";
import { debounceFunc } from "../../utils/assetHelper";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Prevent double verification
  const organization = useSelector(selectOrganization);

  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref"); // For Paystack
  const transaction_id = queryParams.get("transaction_id"); // For Flutterwave
  const reference = queryParams.get("reference"); // For Paystack
  const paymentGateway = queryParams.get("paymentGateway");

  // Subscriptions and Invoices Queries
  const activeSubApiDetails = useGetSubscriptionQuery(organization, {
    skip: !organization, // Fetch when organization is available
  });

  const allSubApiDetails = useGetAllMySubscriptionsQuery(organization, {
    skip: !organization, // Fetch when organization is available
  });

  const invoicesApiDetails = useGetInvoicesQuery(
    { organization, page: 1, limit: 10 },
    {
      skip: !organization, // Fetch when organization is available
    }
  );

  const verifyPayment = async () => {
    if (isVerified) return; // Prevent double verification
    setIsVerified(true); // Mark as verified

    try {
      dispatch(suspenseShow());

      // Verify payment with your backend
      const response = await post("/subscriptions/verify-payment", {
        tx_ref,
        reference,
        transaction_id,
      });

      if (response.status === "success") {
        // Invalidate cache for all related tags
        dispatch(
          api.util.invalidateTags([
            { type: "Invoices", id: "LIST" },
            { type: "Subscriptions", id: "LIST" },
            { type: "Subscription" },
            { type: "UserSubscriptions", id: "LIST" },
          ])
        );

        // Manually refetch all queries
        await Promise.all([
          invoicesApiDetails.refetch(),
          allSubApiDetails.refetch(),
          activeSubApiDetails.refetch(),
        ]);

        Swal.fire({
          title: "Payment Successful!",
          text: "Your subscription has been updated.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#008080",
        }).then(() => {
          navigate("/client/settings/billing");
        });
      } else {
        Swal.fire({
          title: "Payment Failed!",
          text: "Something went wrong with the payment. Please try again.",
          icon: "error",
          confirmButtonText: "Retry",
          confirmButtonColor: "#008080",
        }).then(() => {
          navigate("/client/settings/billing");
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
        navigate("/client/settings/billing");
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

export default PaymentSuccess;
