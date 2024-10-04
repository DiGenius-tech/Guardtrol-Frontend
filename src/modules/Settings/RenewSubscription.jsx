import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import moment from "moment";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import Swal from "sweetalert2";
import { useGetGuardsQuery } from "../../redux/services/guards";
import { useGetBeatsQuery } from "../../redux/services/beats";
import {
  useAddSubscriptionMutation,
  useGetAllMySubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../redux/services/subscriptions";
import { BEAT_PRICE, GUARD_PRICE, POOLING_TIME } from "../../constants/static";
import { useGetInvoicesQuery } from "../../redux/services/invoice";
import { persistor } from "../../redux/store";
import { api } from "../../redux/services/api";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetUserOrganizationRoleQuery } from "../../redux/services/role";

// Constants for pricing

function parseDate(dateString) {
  return new Date(dateString);
}

const RenewSubscription = ({
  openModal,
  setRenewalModal,
  isExpired = false,
}) => {
  const organization = useSelector(selectOrganization);

  const { data: userRole } = useGetUserOrganizationRoleQuery(organization, {
    skip: organization ? false : true,
  });

  const USED_BEAT_PRICE = userRole?.organization?.BEAT_PRICE || BEAT_PRICE;
  const USED_GUARD_PRICE = userRole?.organization?.GUARD_PRICE || GUARD_PRICE;

  const token = useSelector(selectToken);
  const {
    data: subscription,
    isError,
    refetch: refetchActiveSubscription,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, { skip: token ? false : true });

  if (!isUninitialized) {
  }

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);

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
      { organization: organization, page: 1, limit: 10 },
      {
        skip: organization ? false : true,
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
  const [subscriptionAction, setSubscriptionAction] = useState(
    mySuscriptions?.[0] ? "renewal" : "new-subscription"
  );
  const [paymentType, setPaymentType] = useState("recuring");

  const handleBeatChange = (e) => {
    const newBeats = parseInt(e.target.value);

    if (
      subscriptionAction === "reduce" ||
      subscriptionAction === "new-subscription"
    ) {
      setNewMaxBeats(Math.abs(newBeats));
    } else if (subscriptionAction === "increase") {
      setNewMaxBeats(Math.abs(newBeats));
    } else {
      setNewMaxBeats(Math.abs(subscription?.maxbeats));
    }
  };

  const handleGuardChange = (e) => {
    const newGuards = parseInt(e.target.value);
    if (
      subscriptionAction === "reduce" ||
      subscriptionAction === "new-subscription"
    ) {
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
    ...(mySuscriptions?.[0]
      ? [
          { value: "reduce", label: "Reduce" },
          { value: "increase", label: "Increase" },
          { value: "renewal", label: "Renewal" },
        ]
      : [{ value: "new-subscription", label: "New Subscription" }]),
  ];
  const paymentOptions = [
    { value: "paystack", label: "Paystack" },
    { value: "flutterwave", label: "Flutterwave" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    persistor.purge();
    dispatch(api.util.resetApiState());
    dispatch(logout());
    navigate("/auth");
  };

  const onClose = () => {
    toast.error("Payment was closed");
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
    dispatch(suspenseShow());
    updateSubscription();

    setIsLoading(false);
  };

  const updateSubscription = async (transaction) => {
    try {
      dispatch(suspenseShow());
      const s = {
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

      let reqData = {
        newSubscription: {
          totalamount: newSubscriptionTotalAmount,
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
          expiresat: newSubscriptionExpirationDate,
          plan: newSubscription,
          email: user.email,
          paymentgateway: paymentOption,
          startsAt: subscription ? subscription.expiresat : Date.now(),
        },
      };

      const { data } = await createSubscription({
        organization,
        body: reqData,
      });

      const { paymentUrl } = data;
      // const paymentWindow = window.open(paymentUrl);
      window.location.href = paymentUrl;

      // if (paymentWindow) {
      //   const interval = setInterval(() => {
      //     if (paymentWindow.closed) {
      //       window.location.href = "/checkout-success";
      //       clearInterval(interval);
      //     }
      //   }, 1000);
      // }
      // await refetchAllMySubscriptions();
      // await refetchActiveSubscription();
      // await refetchInvoices();

      // if (!isExpired) {
      //   setRenewalModal(false);
      // }
      // dispatch(suspenseHide());
      // if (data) {
      //   Swal.fire({
      //     title: "Renewal successfull",
      //     text: `Your subscription has been updated!`,
      //     icon: "success",
      //     confirmButtonColor: "#008080",
      //   });
      // }
    } catch (error) {
    } finally {
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

    if (subscriptionAction === "new-subscription") {
      beatCost = newMaxBeats * USED_BEAT_PRICE;
      guardCost = newMaxExtraGuards * USED_GUARD_PRICE;
    }
    if (subscriptionAction === "renewal") {
      beatCost = mySuscriptions?.[0]?.maxbeats * USED_BEAT_PRICE;
      guardCost = mySuscriptions?.[0]?.maxextraguards * USED_GUARD_PRICE;

      setNewSubscriptionTotalAmount(months * (beatCost + guardCost));
    } else if (subscriptionAction === "reduce") {
      if (newMaxBeats) {
        beatCost = newMaxBeats * USED_BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost = newMaxExtraGuards * USED_GUARD_PRICE;
      }
    } else if (subscriptionAction === "increase") {
      newTotalGuards =
        newMaxExtraGuards +
        (subscription?.maxextraguards || mySuscriptions[0]?.maxextraguards);

      newTotalBeats =
        newMaxBeats + (subscription?.maxbeats || mySuscriptions[0]?.maxbeats);

      if (newMaxBeats) {
        beatCost = newTotalBeats * USED_BEAT_PRICE;
      } else {
        beatCost =
          (subscription?.maxbeats || mySuscriptions[0]?.maxbeats) *
          USED_BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost =
          (subscription?.maxextraguards || mySuscriptions[0]?.maxextraguards) *
          USED_GUARD_PRICE;
      } else {
        guardCost =
          (subscription?.maxextraguards || mySuscriptions[0]?.maxextraguards) *
          USED_GUARD_PRICE;
      }
    }
    setNewSubscriptionTotalAmount(months * (beatCost + guardCost));
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
                subscriptionAction === "increase" ||
                subscriptionAction === "new-subscription") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <Label
                      htmlFor="newMaxBeats"
                      value={
                        subscriptionAction === "reduce" ||
                        subscriptionAction === "new-subscription"
                          ? "New Total Beat(s)"
                          : "New Additional Beat(s)"
                      }
                    />
                    <TextInput
                      id="newMaxBeats"
                      type="number"
                      placeholder={
                        subscriptionAction === "reduce" ||
                        subscriptionAction === "new-subscription"
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
                        subscriptionAction === "reduce" ||
                        subscriptionAction === "new-subscription"
                          ? "New Extra Guard(s)"
                          : "New Additional Extra Guard(s)"
                      }
                    />
                    <TextInput
                      id="newMaxExtraGuards"
                      type="number"
                      placeholder={
                        subscriptionAction === "reduce" ||
                        subscriptionAction === "new-subscription"
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
                subscriptionAction === "increase" ||
                subscriptionAction === "new-subscription") && (
                <>
                  <div className=" flex flex-row justify-between items-center">
                    <Label className=" text-md" value="New Total Beat(s)" />
                    <span className=" text-gray-500 ">
                      {subscriptionAction !== "renewal"
                        ? subscriptionAction === "reduce" ||
                          subscriptionAction === "new-subscription"
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
                        ? subscriptionAction === "reduce" ||
                          subscriptionAction === "new-subscription"
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
