import { Button, Modal, Label, TextInput, Select, Radio } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../../../redux/selectors/selectedPlan";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import { suspenseShow } from "../../../../redux/slice/suspenseSlice";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";

// Constants for pricing
const BEAT_PRICE = 10000;
const GUARD_PRICE = 2000; // Replace with the actual price of a guard

const RenewSubscription = ({ openModal, setRenewalModal, subscription }) => {
  const dispatch = useDispatch();

  const psConfig = useSelector(selectPsConfig);
  const user = useSelector(selectUser);
  const fwConfig = useSelector(selectFwConfig);
  const token = useSelector(selectToken);

  const {
    plan,
    maxbeats,
    maxextraguards,
    totalamount,
    paymentstatus,
    paymentgateway,
    transactionid,
    expiresat,
  } = subscription;

  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(plan);
  const [newSubscription, setNewSubscription] = useState(plan);
  const [paymentOption, setPaymentOption] = useState(paymentgateway);
  const [newSubscriptionExpirationDate, setNewSubscriptionExpirationDate] =
    useState(new Date(expiresat).toLocaleDateString());
  const [newSubscriptionTotalAmount, setNewSubscriptionTotalAmount] =
    useState(totalamount);
  const [newMaxBeats, setNewMaxBeats] = useState(maxbeats);
  const [newMaxExtraGuards, setNewMaxExtraGuards] = useState(maxextraguards);
  const [subscriptionAction, setSubscriptionAction] = useState("renew");

  const handlePaystackPayment = usePaystackPayment(psConfig);

  const subscriptionOptions = [
    "Select Option",
    "1 Month",
    "3 Months",
    "6 Months",
    "1 Year",
    "2 Years",
  ];

  const subscriptionActions = [
    { value: "reduce", label: "Reduce" },
    { value: "renewal", label: "Renewal" },
    { value: "increase", label: "Increase" },
  ];

  // Initialize the usePaystackPayment hook outside the component function

  const renewWithPaystack = async () => {
    dispatch(suspenseShow());
  };

  const pay = async (e) => {
    e.preventDefault();

    if (paymentOption === "paystack") {
      handlePaystackPayment();
    }
  };
  const paymentOptions = [
    { value: "paystack", label: "Paystack" },
    { value: "paypal", label: "PayPal" },
    { value: "flutterwave", label: "Flutter wave" },
    { value: "bankTransfer", label: "Bank Transfer" },
  ];

  useEffect(() => {
    const currentExpirationDate = new Date(expiresat);
    const subscriptionPeriod = {
      "1 Month": 1,
      "3 Months": 3,
      "6 Months": 6,
      "1 Year": 12,
      "2 Years": 24,
      "Select Option": 24,
    };
    if ("Select Option" === newSubscription) {
      setNewSubscriptionExpirationDate(new Date().toLocaleDateString());
      setNewSubscriptionTotalAmount(0);
      return;
    }
    const months = subscriptionPeriod[newSubscription];
    if (!months) return;
    const newExpirationDate = new Date(
      currentExpirationDate.setMonth(currentExpirationDate.getMonth() + months)
    );
    setNewSubscriptionExpirationDate(newExpirationDate.toLocaleDateString());

    let beatCost = 0;
    let guardCost = 0;
    let newTotalBeats = 0;
    let newTotalGuards = 0;
    if (subscriptionAction === "renewal") {
      setNewSubscriptionTotalAmount(totalamount * months);
      return;
    }
    if (subscriptionAction === "reduce") {
      if (newMaxBeats) {
        beatCost = newMaxBeats * BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost = newMaxExtraGuards * GUARD_PRICE;
      }
    } else if (subscriptionAction === "increase") {
      newTotalGuards = newMaxExtraGuards + maxextraguards;
      newTotalBeats = newMaxBeats + maxbeats;

      if (newMaxBeats) {
        beatCost = newTotalBeats * BEAT_PRICE;
      } else {
        beatCost = maxbeats * BEAT_PRICE;
      }
      if (newMaxExtraGuards) {
        guardCost = maxextraguards * GUARD_PRICE;
      } else {
      }
    }
    setNewSubscriptionTotalAmount(months * beatCost + guardCost);
  }, [
    newSubscription,
    expiresat,
    totalamount,
    newMaxBeats,
    newMaxExtraGuards,
    subscriptionAction,
    maxbeats,
    maxextraguards,
  ]);

  const handleBeatChange = (e) => {
    const newBeats = parseInt(e.target.value);

    if (subscriptionAction === "reduce") {
      setNewMaxBeats(newBeats);
    } else if (subscriptionAction === "increase") {
      setNewMaxBeats(newBeats);
    } else {
      setNewMaxBeats(maxbeats);
    }
  };

  const handleGuardChange = (e) => {
    const newGuards = parseInt(e.target.value);
    if (subscriptionAction === "reduce") {
      setNewMaxExtraGuards(newGuards);
    } else if (subscriptionAction === "increase") {
      setNewMaxExtraGuards(newGuards);
    } else {
      setNewMaxExtraGuards(maxextraguards);
    }
  };

  return (
    <Modal dismissible show={openModal} onClose={() => setRenewalModal(false)}>
      <Modal.Header>Subscription Renewal</Modal.Header>
      <Modal.Body>
        <form method="post" className="space-y-6" onSubmit={pay}>
          <div className=" flex flex-row justify-between items-center">
            <Label
              htmlFor="currentSubscription"
              className=" text-md"
              value="Current Subscription"
            />
            <span className=" text-gray-500 ">{`Expires on ${new Date(
              expiresat
            ).toLocaleDateString()}`}</span>
          </div>
          <hr />
          <div className=" flex flex-row justify-between items-center">
            <fieldset className="flex max-w-md flex-col gap-4">
              <legend className="mb-4 font-medium">
                Select renewal information
              </legend>
              <div className="flex flex-row  gap-4">
                {subscriptionActions.map((action) => (
                  <div className="flex items-center gap-2">
                    <Radio
                      key={action.value}
                      value={action.value}
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
                      ? "New total beats"
                      : "New additional beats"
                  }
                />
                <TextInput
                  id="newMaxBeats"
                  type="number"
                  placeholder={
                    subscriptionAction === "reduce"
                      ? "Enter beats you would like have"
                      : "Enter beats you would like to add"
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
                      ? "New extra-guards"
                      : "New additional extra-guards"
                  }
                />
                <TextInput
                  id="newMaxExtraGuards"
                  type="number"
                  placeholder={
                    subscriptionAction === "reduce"
                      ? "Enter extra guards you would like have"
                      : "Enter extra guards you would like to add"
                  }
                  value={newMaxExtraGuards}
                  onChange={handleGuardChange}
                />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="newSubscription" value="New Subscription" />
            <Select
              id="newSubscription"
              value={newSubscription}
              onChange={(event) => setNewSubscription(event.target.value)}
            >
              {subscriptionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <hr />
          <div className="text-lg font-medium mt-1">
            New Subscription details
          </div>
          <div className=" flex flex-row justify-between items-center">
            <Label
              className=" text-md"
              htmlFor="newSubscription"
              value="After renewal next subscription will be due on"
            />
            <span className=" text-gray-500 ">
              {newSubscriptionExpirationDate
                ? newSubscriptionExpirationDate
                : "-"}
            </span>
          </div>
          {(subscriptionAction === "reduce" ||
            subscriptionAction === "increase") && (
            <>
              <div className=" flex flex-row justify-between items-center">
                <Label className=" text-md" value="New total beats" />
                <span className=" text-gray-500 ">
                  {subscriptionAction !== "renewal"
                    ? subscriptionAction === "reduce"
                      ? newMaxBeats || "0"
                      : maxbeats
                    : maxbeats + newMaxBeats || maxbeats}
                </span>
              </div>
              <div className=" flex flex-row justify-between items-center">
                <Label className=" text-md" value="New extra guards" />
                <span className=" text-gray-500 ">
                  {subscriptionAction !== "renewal"
                    ? subscriptionAction === "reduce"
                      ? newMaxExtraGuards || "0"
                      : maxextraguards + newMaxExtraGuards || maxextraguards
                    : maxextraguards}
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
          </div>{" "}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <RegularButton color="blue">Renew</RegularButton>
        <Button color="gray" onClick={() => setRenewalModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>{" "}
    </Modal>
  );
};
export default RenewSubscription;
