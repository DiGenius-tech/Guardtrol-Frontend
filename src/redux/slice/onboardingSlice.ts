// SubscriptionSlice.ts
import { createSelector, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { TUser } from "../../types/user";
import { TSubscription } from "../../types/subscription";
import { PURGE } from "redux-persist";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors/auth';

interface Subscription {
  onboardingLevel: number | null;
  subscription: any;
  guards: any;
}

const initialState: Subscription | null = {
  onboardingLevel: null,
  subscription: {
    plan: {
      amount: undefined,
      extraguards: undefined,
      numberofbeats: undefined,
      type: undefined,
    },
    paystack: {
      email: undefined,
      amount: undefined,
      metadata: {
        name: undefined,
        phone: undefined,
      },
      publicKey: process.env.REACT_APP_PAYSTACK_KEY,
    },
    flutter: {
      public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
      tx_ref: Date.now(),
      amount: undefined,
      currency: undefined,
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
  },
  guards: [],
};

const onboardingSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPsConfig(
      state,
      action: PayloadAction<{
        email: string;
        amount: number;
        name: string;
        type: string;
        currency?: string;
      }>
    ) {
      state.subscription.psConfig = {
        email: action.payload.email,
        amount: action.payload.amount * 100,
        metadata: {
          phone: undefined,
          name: action.payload.name,
        },
        publicKey: process.env.REACT_APP_PAYSTACK_KEY,
        currency: action.payload.currency || 'NGN',
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
        currency?: string;
      }>
    ) {
      state.subscription.fwConfig = {
        public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
        tx_ref: Date.now(),
        amount: action.payload?.amount,
        currency: action.payload.currency || 'NGN',
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
      state.subscription.plan = {
        amount: action.payload.amount,
        extraguards: action.payload.extraguards,
        numberofbeats: action.payload.numberofbeats,
        type: action.payload.type,
      };
    },
    setOnboardingLevel(state, action) {
      state.onboardingLevel = action.payload;
    },
    setOnboardingGuards(state, action) {
      state.guards = action.payload;
    },
    addOnboardingGuard(state, action) {
      state.guards = [...state.guards, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const {
  setOnboardingLevel,
  addOnboardingGuard,
  setOnboardingGuards,
  setFwConfig,
  setPsConfig,
  setPlan,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
