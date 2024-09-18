import React, { useState, useEffect } from "react";
import { MdAddHomeWork, MdPeople } from "react-icons/md";
import {
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../redux/services/subscriptions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { BEAT_PRICE, GUARD_PRICE, POOLING_TIME } from "../../constants/static";
import { Label, Select } from "flowbite-react";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../redux/selectors/selectedPlan";
import { usePaystackPayment } from "react-paystack";
import Swal from "sweetalert2";
import { useFlutterwave } from "flutterwave-react-v3";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { toast } from "react-toastify";
import { useGetInvoicesQuery } from "../../redux/services/invoice";

const UpdateSubscription = () => {
  const token = useSelector(selectToken);
  const psConfig = useSelector(selectPsConfig);
  const user = useSelector(selectUser);
  const fwConfig = useSelector(selectFwConfig);
  const organization = useSelector(selectOrganization);

  const dispatch = useDispatch();
  const {
    data: currentSubscription,
    isError,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  const { data: mySuscriptions, refetch: refetchAllMySubscriptions } =
    useGetAllMySubscriptionsQuery(organization, {
      skip: organization ? false : true,
    });

  const { data: invoicesApiResponse, refetch: refetchInvoices } =
    useGetInvoicesQuery(
      { organization },
      {
        skip: organization ? false : true,
        pollingInterval: POOLING_TIME,
      }
    );
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const [remainingDays, setRemainingDays] = useState(0);
  const [psConfigState, setPsConfigState] = useState(psConfig);
  const [additionalBeats, setAdditionalBeats] = useState(0);
  const [additionalGuards, setAdditionalGuards] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentOption, setPaymentOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const paymentOptions = [
    { value: "paystack", label: "Paystack" },
    { value: "flutterwave", label: "Flutter wave" },
  ];

  const handleFlutterPayment = useFlutterwave({
    public_key: fwConfig.public_key,
    tx_ref: Date.now(),
    amount: totalCost,
    currency: "NGN",
    payment_options: "all",
    payment_plan: undefined,
    customer: {
      email: user.email,
      phone_number: user.phone,
      name: user.name,
    },
    meta: {
      counsumer_id: user._id,
      consumer_mac: undefined,
    },
    customizations: {
      title: "Guardtrol Lite Subscription",
      description: undefined,
      logo: "https://guardtrol.alphatrol.com/logo192.png",
    },
  });

  const handlePaystackPayment = usePaystackPayment({
    publicKey: psConfigState.publicKey,
    email: user.email,
    amount: totalCost * 100,
  });

  const payWithFlutterwave = async () => {
    dispatch(suspenseShow());

    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          handleUpdateSubscription(response);
        }
      },
      onClose: () => {
        dispatch(suspenseHide());
        toast.warn("Payment Window Closed, Payment Cancelled");
      },
    });
  };

  const payWithPaystack = async () => {
    dispatch(suspenseShow());
    handlePaystackPayment({
      onSuccess: (response) => {
        handleUpdateSubscription(response);
      },
      onClose: () => {
        toast.warn("Payment Window Closed, Payment Cancelled");
        dispatch(suspenseHide());
      },
    });
  };

  const handleUpdateSubscription = async (response) => {
    dispatch(suspenseShow());
    try {
      const reqData = {
        _id: currentSubscription?._id,
        ...response,
        transactionid: response.transaction,
        maxbeats: additionalBeats + currentSubscription?.maxbeats,
        maxextraguards: additionalGuards + currentSubscription?.maxextraguards,
        totalamount: totalCost + currentSubscription?.totalamount,
        paymentstatus: "complete",
        plan: currentSubscription?.plan,
        expiresat: currentSubscription?.expiresat,
        paymentgateway: paymentOption,
      };

      const { data } = await updateSubscription({
        organization,
        body: reqData,
      });
      await refetchInvoices();
      await refetchAllMySubscriptions();
      await refetchActiveSubscription();

      Swal.fire({
        title: "Subscription updated successfully",
        text: `Your subscription has been updated!`,
        icon: "success",
        confirmButtonColor: "#008080",
      });

      // if (data) {
      //   Swal.fire({
      //     title: "Renewal succefull",
      //     text: `Your subscription has been updated!`,
      //     icon: "success",
      //     confirmButtonColor: "#008080",
      //   });
      // }
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };

  const pay = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    if (paymentOption === "flutterwave") {
      payWithFlutterwave();
    } else {
      payWithPaystack();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const today = new Date();
    const expirationDate = new Date(currentSubscription?.expiresat);
    const diffInDays = Math.ceil(
      (expirationDate - today) / (1000 * 60 * 60 * 24)
    );
    setRemainingDays(diffInDays);
  }, [currentSubscription?.expirationDate]);

  useEffect(() => {
    const beatCost = additionalBeats * BEAT_PRICE * (remainingDays / 30);
    const guardCost = additionalGuards * GUARD_PRICE * (remainingDays / 30);

    setTotalCost(Math.ceil(beatCost + guardCost));
  }, [
    additionalBeats,
    additionalGuards,
    remainingDays,
    currentSubscription?.beatCost,
    currentSubscription?.guardCost,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    pay();

    const updatedSubscription = {
      ...currentSubscription,
      beats: currentSubscription?.beats + additionalBeats,
      guards: currentSubscription?.guards + additionalGuards,
      expirationDate:
        currentSubscription?.ea /* Calculate the new expiration date based on the remaining days */,
    };
  };

  return (
    <div className="col-span-12">
      <form className="bg-white rounded-md p-4" onSubmit={handleSubmit}>
        <span
          htmlFor="email-address-icon"
          className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
        >
          Enter Update Details
        </span>
        <div className="mb-4">
          <label
            htmlFor="email-address-icon"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Beat(s)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <MdAddHomeWork color="#79716b" />
            </div>
            <input
              type="number"
              placeholder="Enter amount of beats you would like to add"
              id="email-address-icon"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              value={additionalBeats}
              onChange={(e) => setAdditionalBeats(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div>
          <p className="text-gray-900 text-sm">
            {`After payment, your new total Beat(s) will be ${
              additionalBeats
                ? currentSubscription.maxbeats + additionalBeats
                : "added."
            } `}
          </p>
        </div>
        <div className="mb-4">
          <label
            htmlFor="email-address-icon"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Guard(s)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <MdPeople color="#79716b" />
            </div>
            <input
              type="number"
              placeholder="Enter amount of guards you would like to add"
              id="email-address-icon"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              value={additionalGuards}
              onChange={(e) => setAdditionalGuards(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
          <p className="text-gray-900 text-sm">
            {`After payment, your new extra Guard(s)
            will be ${
              additionalGuards
                ? currentSubscription.maxextraguards + additionalGuards || 0
                : "added."
            }`}
          </p>
        </div>

        <div className="mb-3">
          <Label htmlFor="paymentOption" value="Payment Option" />
          <Select
            id="paymentOption"
            value={paymentOption}
            onChange={(event) => {
              setPaymentOption(event.target.value);
            }}
          >
            {paymentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <button
          type="submit"
          style={{ backgroundColor: "#008080" }}
          className="w-full block text-white focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Continue to pay{" "}
          <span className="text-lg font-semibold">
            ₦{totalCost ? totalCost?.toFixed(2) : 0}
          </span>
        </button>
      </form>
    </div>
  );
};

export default UpdateSubscription;
