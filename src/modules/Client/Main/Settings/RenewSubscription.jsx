import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFwConfig,
  selectPsConfig,
} from "../../../../redux/selectors/selectedPlan";
import { selectToken, selectUser } from "../../../../redux/selectors/auth";
import { usePaystackPayment } from "react-paystack";
import { suspenseShow } from "../../../../redux/slice/suspenseSlice";
import { toast } from "react-toastify";

export function RenewSubscription({
  openModal,
  setRenewalModal,
  subscription,
}) {
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
    useState(expiresat);
  const [newSubscriptionTotalAmount, setNewSubscriptionTotalAmount] =
    useState(totalamount);

  const subscriptionOptions = [
    "Select Option",
    "1 Month",
    "3 Months",
    "6 Months",
    "1 Year",
    "2 Years",
  ];

  // Initialize the usePaystackPayment hook outside the component function

  const renewWithPaystack = async () => {
    dispatch(suspenseShow());
  };

  const pay = async (e) => {
    e.preventDefault();

    if (false) {
      renewWithPaystack();
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
    const newExpirationDate = new Date(
      currentExpirationDate.setMonth(currentExpirationDate.getMonth() + months)
    );
    setNewSubscriptionExpirationDate(newExpirationDate.toLocaleDateString());
    setNewSubscriptionTotalAmount(totalamount * months); // Assuming the total amount is calculated per month
  }, [newSubscription, expiresat, totalamount]);

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
          <div className=" flex flex-row justify-between items-center">
            <Label
              htmlFor="newSubscription"
              value="After renewal Subscription will be due on"
            />
            <span className=" text-gray-500 ">
              {newSubscriptionExpirationDate}
            </span>
          </div>
          <div className=" flex flex-row justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className=" text-lg font-semibold">{`₦ ${newSubscriptionTotalAmount.toLocaleString()}`}</span>
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
        <Button color="blue">Renew</Button>
        <Button color="gray" onClick={() => setRenewalModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>{" "}
    </Modal>
  );
}
