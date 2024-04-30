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
  reducers: {
    setPsConfig(
      state,
      action: PayloadAction<{
        email: string;
        amount: number;
        name: string;
        type: string;
      }>
    ) {
      state.psConfig = {
        email: action.payload.email,
        amount: action.payload.amount * 100,
        metadata: {
          phone: undefined,
          name: action.payload.name,
        },
        publicKey: process.env.REACT_APP_PAYSTACK_KEY,
      };
    },

    setFwConfig(
      state,
      action: PayloadAction<{
        email: string;
        amount: number;
        name: string;
        type: string;
        userid: string;
        clientid: string;
      }>
    ) {
      state.fwConfig = {
        public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
        tx_ref: Date.now(),
        amount: action.payload?.amount,
        currency: "NGN",
        payment_options: "all",
        payment_plan: action.payload.type,
        customer: {
          email: action.payload.email,
          phone_number: undefined,
          name: action.payload.name,
        },
        meta: {
          counsumer_id: action.payload.userid,
          consumer_mac: action.payload.clientid,
        },
        customizations: {
          title: "Guardtrol Lite Subscription",
          description: `${action.payload?.type} subscription to guardtrol lite`,
          logo: "https://guardtrol.alphatrol.com/logo192.png",
        },
      };
    },

    setPlan(
      state,
      action: PayloadAction<{
        amount: number;
        extraguards: number;
        numberofbeats: number;
        type: string;
      }>
    ) {
      console.log(action);
      state.plan = {
        amount: action.payload.amount,
        extraguards: action.payload.extraguards,
        numberofbeats: action.payload.numberofbeats,
        type: action.payload.type,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { setFwConfig, setPsConfig, setPlan } = SelectedPlanSlice.actions;
export default SelectedPlanSlice.reducer;
