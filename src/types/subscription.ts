import { TChargeAuthorization } from "./charge-authorization";

export type TSubscription = {
  _id: string;
  user: string;
  retries: number;
  charge: TChargeAuthorization;
  plan: "monthly" | "yearly";
  maxbeats: number;
  maxextraguards?: number;
  totalamount: number;
  paymentstatus: "pending" | "complete";
  paymentgateway?: "flutterwave" | "paystack";
  transactionid?: string;
  createdat: Date;
  updatedat: Date;
  expiresat: Date;
  paymentlog: any; // You might want to define a specific type for paymentlog
};
