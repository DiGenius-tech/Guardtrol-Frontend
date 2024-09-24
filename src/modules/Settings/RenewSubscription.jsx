import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaystackPop from "@paystack/inline-js";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../redux/selectors/selectedPlan";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import moment from "moment";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { post } from "../../lib/methods";
import Swal from "sweetalert2";
import { useGetGuardsQuery } from "../../redux/services/guards";
import { useGetBeatsQuery } from "../../redux/services/beats";
import {
  useAddSubscriptionMutation,
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../redux/services/subscriptions";
import { BEAT_PRICE, GUARD_PRICE, POOLING_TIME } from "../../constants/static";
import axios from "axios";
import { useGetInvoicesQuery } from "../../redux/services/invoice";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

// Constants for pricing

function parseDate(dateString) {
  return new Date(dateString);
}

const RenewSubscription = ({
  openModal,
  setRenewalModal,
  isExpired = false,
}) => {
  const psConfig = useSelector(selectPsConfig);
  const organization = useSelector(selectOrganization);
  // const paystack = new PaystackPop();
  const token = useSelector(selectToken);
  const {
    data: subscription,
    isError,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, { skip: token ? false : true });

  if (!isUninitialized) {
    // refetchActiveSubscription();
  }

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);

  const fwConfig = useSelector(selectFwConfig);

  const currentDate = new Date();
  const { data: availableGuards } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );
  const { data: beatsApiResponse } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
      pollingInterval: POOLING_TIME,
    }
  );

  const { data: mySuscriptions, refetch: refetchAllMySubscriptions } =
    useGetAllMySubscriptionsQuery(organization, {
      skip: organization ? false : true,
    });
  const [createSubscription] = useAddSubscriptionMutation();
  const { data: invoicesApiResponse, refetch: refetchInvoices } =
    useGetInvoicesQuery(
      { organization },
      {
        skip: organization ? false : true,
        pollingInterval: POOLING_TIME,
      }
    );

  const activeSubscriptions = mySuscriptions?.filter(
    (subscription) => parseDate(subscription?.expiresat) > currentDate
  );

  // Check if the user has more than one active or future subscription
  const hasTooManyActiveSubscriptions = activeSubscriptions?.length > 1;

  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(
    subscription?.plan
  );
  const [newSubscription, setNewSubscription] = useState("monthly");
  const [paymentOption, setPaymentOption] = useState("paystack");
  const [newSubscriptionExpirationDate, setNewSubscriptionExpirationDate] =
    useState(
      subscription
        ? new Date(subscription?.expiresat).toLocaleDateString()
        : "--"
    );

  const [newSubscriptionTotalAmount, setNewSubscriptionTotalAmount] = useState(
    subscription?.totalamount
  );
  const [newMaxBeats, setNewMaxBeats] = useState(subscription?.maxbeats);
  const [newMaxExtraGuards, setNewMaxExtraGuards] = useState(
    subscription?.maxextraguards
  );
  const [subscriptionAction, setSubscriptionAction] = useState("renewal");
  const [paymentType, setPaymentType] = useState("recuring");

  const handleBeatChange = (e) => {
    const newBeats = parseInt(e.target.value);

    if (subscriptionAction === "reduce") {
      setNewMaxBeats(Math.abs(newBeats));
    } else if (subscriptionAction === "increase") {
      setNewMaxBeats(Math.abs(newBeats));
    } else {
      setNewMaxBeats(Math.abs(subscription?.maxbeats));
    }
  };

  const handleGuardChange = (e) => {
    const newGuards = parseInt(e.target.value);
    if (subscriptionAction === "reduce") {
      setNewMaxExtraGuards(Math.abs(newGuards));
    } else if (subscriptionAction === "increase") {
      setNewMaxExtraGuards(Math.abs(newGuards));
    } else {
      setNewMaxExtraGuards(Math.abs(subscription?.maxextraguards));
    }
  };

  const subscriptionOptions = [
    { name: "Select Option", value: "" },
    { name: "1 Month", value: "monthly" },
    { name: "3 Months", value: "quarterly" },
    { name: "6 Months", value: "biannually" },
    { name: "1 Year", value: "annually" },
  ];

  const subscriptionActions = [
    { value: "reduce", label: "Reduce" },
    { value: "increase", label: "Increase" },
    ...(mySuscriptions?.[0] ? [{ value: "renewal", label: "Renewal" }] : []),
  ];
  const paymentOptions = [
    { value: "paystack", label: "Paystack" },
    { value: "flutterwave", label: "Flutterwave" },
  ];

  const handleFlutterPayment = useFlutterwave({
    public_key: fwConfig.public_key,
    tx_ref: Date.now(),
    amount: newSubscriptionTotalAmount,
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

  // const handleCreatePlan = async () => {
  //   const { data } = await axios.post(
  //     "https://api.paystack.co/plan",
  //     {
  //       name: `${user.name}-${new Date()}-${newSubscription}`,
  //       interval: newSubscription,
  //       amount: newSubscriptionTotalAmount * 100,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer sk_test_b2c61ba5551dea400c429e6d82860a227247b11b`,
  //       },
  //     }
  //   );

  //   return data;
  // };

  const navigate = useNavigate();

  // const handlePaystackPayment = usePaystackPayment({
  //   ...psConfig,
  //   email: user.email,
  //   amount: newSubscriptionTotalAmount * 100,
  // });

  const payWithFlutterwave = async () => {
    dispatch(suspenseShow());

    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          updateSubscription(response);
        }
        closePaymentModal();
      },
      onClose: () => {
        dispatch(suspenseHide());
        toast.warn("Payment Window Closed, Payment Cancelled");
      },
    });
  };

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };

  let paymentConfig = {
    publicKey: psConfig.publicKey,
    email: user.email,
    amount: newSubscriptionTotalAmount * 100, // amount in kobo
    reference: new Date().getTime().toString(),
  };

  const handlePaystackPayment = usePaystackPayment(paymentConfig);

  const onClose = () => {
    dispatch(suspenseHide());
    toast.error("Payment was closed");
  };

  const payWithPaystack = async () => {
    try {
      dispatch(suspenseShow());
      // const { data: planData } = await handleCreatePlan();

      const paymentData = {
        key: psConfig.publicKey,
        email: user.email,

        channels: ["card"],
        metadata: {
          custom_fields: [
            {
              display_name: "Beats",
              variable_name: "beats",
              value: newMaxBeats,
            },
            {
              display_name: "Guards",
              variable_name: "guards",
              value: newMaxExtraGuards,
            },
          ],
        },
        // plan: planData?.plan_code,
        onSuccess: (transaction) => {
          if (!isExpired) {
            setRenewalModal(false);
          }

          updateSubscription(transaction);
        },
        onCancel: () => {
          dispatch(suspenseHide());
        },
      };

      const initiatePayment = () => {
        const res = handlePaystackPayment({
          onSuccess: (transaction) => {
            updateSubscription(transaction);
          },
          onClose,
        });
        // paystack.newTransaction(paymentData);
      };

      initiatePayment();
    } catch (error) {
    } finally {
      // dispatch(suspenseHide());
    }
  };

  const pay = async (e) => {
    if (subscriptionAction === "reduce") {
      if (availableGuards > newMaxExtraGuards) {
        Swal.fire({
          title: "Invalid Input",
          text: `Your entered amount of guards is less than your available gurads, Delete gaurds!, your availble guards must not be more than ${newMaxExtraGuards}`,
          icon: "warning",
          confirmButtonColor: "#008080",
        });
        return;
      }
      if (beatsApiResponse?.beats?.length > newMaxBeats) {
        Swal.fire({
          title: "Invalid Input",
          text: `Your entered amount of beats is less than your available beats, Delete beats!, your availble beats must not be more than ${newMaxBeats}`,
          icon: "warning",
          cancelButtonText: "OK",
          confirmButtonColor: "#008080",
        });
        return;
      }
    }
    e?.preventDefault();
    setIsLoading(true);
    if (paymentOption === "flutterwave") {
      payWithFlutterwave();
    } else {
      payWithPaystack();
    }
    setIsLoading(false);
  };

  const updateSubscription = async (transaction) => {
    try {
      const reqData = {
        ...transaction,
        maxbeats:
          subscriptionAction === "renewal"
            ? subscription
              ? subscription?.maxbeats
              : mySuscriptions[0]?.maxbeats
            : newMaxBeats,
        maxextraguards:
          subscriptionAction === "renewal"
            ? subscription
              ? subscription?.maxextraguards
              : mySuscriptions[0]?.maxextraguards
            : newMaxExtraGuards,
        totalamount: newSubscriptionTotalAmount,
        paymentstatus: "complete",
        plan: newSubscription,
        expiresat: newSubscriptionExpirationDate,
        startsAt: subscription ? subscription.expiresat : Date.now(),
        paymentgateway: paymentOption,
      };
      const { data } = await createSubscription({
        organization,
        body: reqData,
      });

      await refetchAllMySubscriptions();
      await refetchActiveSubscription();
      await refetchInvoices();

      if (!isExpired) {
        setRenewalModal(false);
      }
      dispatch(suspenseHide());
      if (data) {
        Swal.fire({
          title: "Renewal succefull",
          text: `Your subscription has been updated!`,
          icon: "success",
          confirmButtonColor: "#008080",
        });
      }
    } catch (error) {
    } finally {
      dispatch(suspenseHide());
    }
  };

  useEffect(() => {
    const currentExpirationDate = new Date(
      activeSubscriptions?.[0]?.expiresat || Date.now()
    );
    const subscriptionPeriod = {
      monthly: 1,
      quarterly: 3,
      biannually: 6,
      annually: 12,
      "Select Option": 24,
    };

    if ("Select Option" === newSubscription || "" === newSubscription) {
      // setNewSubscriptionExpirationDate(
      //   moment(new Date()).format("DD MMMM, YYYY")
      // );

      setNewSubscriptionExpirationDate("");
      setNewSubscriptionTotalAmount(0);
      return;
    }

    const months = subscriptionPeriod[newSubscription];

    if (!months) return;

    const newExpirationDate = new Date(
      currentExpirationDate.setMonth(currentExpirationDate.getMonth() + months)
    );
    setNewSubscriptionExpirationDate(new Date(newExpirationDate));

    let beatCost = 0;
    let guardCost = 0;
    let newTotalBeats = 0;
    let newTotalGuards = 0;

    if (subscriptionAction === "renewal") {
      beatCost = mySuscriptions?.[0]?.maxbeats * BEAT_PRICE;
      guardCost = mySuscriptions?.[0]?.maxextraguards * BEAT_PRICE;
      setNewSubscriptionTotalAmount(months * beatCost + guardCost);

      // setNewSubscriptionTotalAmount(mySuscriptions?.[0]?.totalamount * months);
    } else if (subscriptionAction === "reduce") {
      if (newMaxBeats) {
        beatCost = newMaxBeats * BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost = newMaxExtraGuards * GUARD_PRICE;
      }
    } else if (subscriptionAction === "increase") {
      newTotalGuards =
        newMaxExtraGuards +
        (subscription?.maxextraguards || mySuscriptions[0]?.maxextraguards);
      newTotalBeats =
        newMaxBeats + (subscription?.maxbeats || mySuscriptions[0]?.maxbeats);

      if (newMaxBeats) {
        beatCost = newTotalBeats * BEAT_PRICE;
      } else {
        beatCost =
          (subscription?.maxbeats || mySuscriptions[0]?.maxbeats) * BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost =
          (subscription?.maxextraguards || mySuscriptions[0]?.maxextraguards) *
          GUARD_PRICE;
      } else {
      }
    }
    setNewSubscriptionTotalAmount(months * beatCost + guardCost);
  }, [
    newSubscription,
    newMaxBeats,
    newMaxExtraGuards,
    subscriptionAction,
    subscription,
    mySuscriptions,
  ]);

  return (
    <Modal
      dismissible={!isExpired}
      show={openModal}
      onClose={() => setRenewalModal(false)}
    >
      <Modal.Header>Subscription Renewal</Modal.Header>
      <Modal.Body>
        <form method="post" className="space-y-6" onSubmit={pay}>
          <div className=" flex flex-row justify-between items-center">
            <Label
              htmlFor="currentSubscription"
              className=" text-md"
              value="Current Subscription"
            />
            <span className=" text-gray-500 ">{`${
              subscription
                ? `Expires on ${moment(
                    new Date(subscription?.expiresat)
                  ).format("DD MMMM, YYYY")}`
                : "No Active Subscription"
            }`}</span>
          </div>
          {isExpired && (
            <div className=" flex flex-row justify-between items-center">
              <span className=" text-gray-500 ">
                Your subscription is expired to access Guardtrol, you are
                required to renew your subscription.
              </span>
            </div>
          )}
          <hr />
          {hasTooManyActiveSubscriptions && (
            <>
              {activeSubscriptions
                .filter((active) => active._id !== subscription?._id)
                .map((activesub) => (
                  <>
                    <div
                      key={activesub._id}
                      className=" flex flex-row justify-between items-center"
                    >
                      <Label
                        htmlFor="currentSubscription"
                        className=" text-md"
                        value="Next Subscription"
                      />
                      <span className=" text-gray-500 ">{`Expires on ${new Date(
                        activesub.expiresat
                      ).toLocaleDateString()}`}</span>
                    </div>
                    <hr />
                  </>
                ))}
            </>
          )}
          {!hasTooManyActiveSubscriptions && (
            <>
              <div className=" flex flex-row justify-between items-center">
                <fieldset className="flex max-w-md flex-col gap-4">
                  <legend className="mb-4 font-medium">
                    Select Renewal Information
                  </legend>
                  <div className="flex flex-row  gap-4">
                    {subscriptionActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Radio
                          key={action.value}
                          value={action.value}
                          checked={subscriptionAction === action.value}
                          style={{ color: "#008080" }}
                          id={action.value}
                          onClick={(event) =>
                            setSubscriptionAction(event.target.value)
                          }
                          name="subscriptionActions"
                        />
                        <Label htmlFor={action.value}> {action.label}</Label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              {(subscriptionAction === "reduce" ||
                subscriptionAction === "increase") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <Label
                      htmlFor="newMaxBeats"
                      value={
                        subscriptionAction === "reduce"
                          ? "New Total Beat(s)"
                          : "New Additional Beat(s)"
                      }
                    />
                    <TextInput
                      id="newMaxBeats"
                      type="number"
                      placeholder={
                        subscriptionAction === "reduce"
                          ? "Enter Beats you would like have"
                          : "Enter Beats you would like to add"
                      }
                      value={newMaxBeats}
                      onChange={handleBeatChange}
                    />
                  </div>
                  <div className="">
                    <Label
                      htmlFor="newMaxExtraGuards"
                      value={
                        subscriptionAction === "reduce"
                          ? "New Extra Guard(s)"
                          : "New Additional Extra Guard(s)"
                      }
                    />
                    <TextInput
                      id="newMaxExtraGuards"
                      type="number"
                      placeholder={
                        subscriptionAction === "reduce"
                          ? "Enter Extra Guards you would like have"
                          : "Enter Extra Guards you would like to add"
                      }
                      value={newMaxExtraGuards}
                      onChange={handleGuardChange}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="newSubscription" value="New Payment Plan" />
                <Select
                  id="newSubscription"
                  value={newSubscription}
                  onChange={(event) => setNewSubscription(event.target.value)}
                >
                  {subscriptionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </div>
              <hr />
              <div className="text-lg font-medium mt-1">
                New Subscription Details
              </div>
              <div className=" flex flex-row justify-between items-center">
                <Label
                  className=" text-md"
                  htmlFor="newSubscription"
                  value="After renewal, next subscription will be due on"
                />
                <span className=" text-gray-500 ">
                  {newSubscriptionExpirationDate
                    ? moment(newSubscriptionExpirationDate).format(
                        "DD MMMM, YYYY"
                      ) === "Invalid date"
                      ? ""
                      : moment(newSubscriptionExpirationDate).format(
                          "DD MMMM, YYYY"
                        )
                    : "-"}
                </span>
              </div>
              {(subscriptionAction === "reduce" ||
                subscriptionAction === "increase") && (
                <>
                  <div className=" flex flex-row justify-between items-center">
                    <Label className=" text-md" value="New Total Beat(s)" />
                    <span className=" text-gray-500 ">
                      {subscriptionAction !== "renewal"
                        ? subscriptionAction === "reduce"
                          ? newMaxBeats || "0"
                          : (subscription?.maxbeats ||
                              mySuscriptions[0]?.maxbeats) + newMaxBeats ||
                            subscription?.maxbeats ||
                            mySuscriptions[0]?.maxbeats
                        : subscription?.maxbeats || mySuscriptions[0]?.maxbeats}
                    </span>
                  </div>
                  <div className=" flex flex-row justify-between items-center">
                    <Label className=" text-md" value="New Extra Guards" />
                    <span className=" text-gray-500 ">
                      {subscriptionAction !== "renewal"
                        ? subscriptionAction === "reduce"
                          ? newMaxExtraGuards || "0"
                          : (subscription?.maxextraguards ||
                              mySuscriptions[0]?.maxextraguards) +
                              newMaxExtraGuards ||
                            subscription?.maxextraguards ||
                            mySuscriptions[0]?.maxextraguards
                        : subscription?.maxextraguards ||
                          mySuscriptions[0]?.maxextraguards}
                    </span>
                  </div>
                </>
              )}
              <div className=" flex flex-row justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className=" text-lg font-semibold">{`₦ ${
                  newSubscriptionTotalAmount
                    ? newSubscriptionTotalAmount.toLocaleString()
                    : 0
                }`}</span>
              </div>
              <div>
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
            </>
          )}
        </form>
      </Modal.Body>
      {!hasTooManyActiveSubscriptions && (
        <Modal.Footer>
          <Button
            isProcessing={isLoading}
            disabled={isLoading || Number(newSubscriptionTotalAmount) === 0}
            onClick={() => pay()}
            style={{ backgroundColor: "#008080" }}
            type="submit"
          >
            Renew
          </Button>
          <Button color="gray" onClick={() => setRenewalModal(false)}>
            Cancel
          </Button>
          {isExpired && (
            <Button color="red" onClick={() => handleLogout()}>
              Logout
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};
export default RenewSubscription;
