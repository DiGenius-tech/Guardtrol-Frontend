import { useSelector } from "react-redux";
import { selectUser } from "../selectors/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

interface SelectedPlan {
  fwConfig:
    | {
        public_key: String | undefined;
        tx_ref: Number | undefined;
        amount: Number | undefined;
        currency: String | undefined;
        payment_options: String | undefined;
        payment_plan: String | undefined;
        customer: {
          email: String | undefined;
          phone_number: Number | undefined;
          name: String | undefined;
        };
        meta: {
          counsumer_id: String | undefined;
          consumer_mac: String | undefined;
        };
        customizations: {
          title: String | undefined;
          description: String | undefined;
          logo: String | undefined; // "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
        };
      }
    | undefined;
  psConfig:
    | {
        email: String | undefined;
        amount: Number | undefined;
        metadata: {
          name: String | undefined;
          phone: Number | undefined;
        };
        publicKey: String | undefined;
      }
    | undefined;
  plan:
    | {
        amount: number | undefined;
        extraguards: number | undefined;
        numberofbeats: number | undefined;
        type: string | undefined;
      }
    | undefined;
}

const initialState: SelectedPlan = {
  fwConfig: {
    public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
    tx_ref: Date.now(),
    amount: undefined,
    currency: "NGN",
    payment_options: "all",
    payment_plan: undefined,
    customer: {
      email: undefined,
      phone_number: undefined,
      name: undefined,
    },
    meta: {
      counsumer_id: undefined,
      consumer_mac: undefined,
    },
    customizations: {
      title: "Guardtrol Lite Subscription",
      description: undefined,
      logo: "https://guardtrol.alphatrol.com/logo192.png",
    },
  },
  psConfig: {
    email: undefined,
    amount: undefined,
    metadata: {
      name: undefined,
      phone: undefined,
    },
    publicKey: process.env.REACT_APP_PAYSTACK_KEY,
  },
  plan: {
    amount: undefined,
    extraguards: undefined,
    numberofbeats: undefined,
    type: undefined,
  },
};

const SelectedPlanSlice = createSlice({
  name: "selectedPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

// export const { setFwConfig, setPsConfig, setPlan } = SelectedPlanSlice.actions;
export default SelectedPlanSlice.reducer;
