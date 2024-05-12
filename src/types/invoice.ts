import { TGuard } from "./guad";
import { TUser } from "./user";

export type TInvoice = {
  subscription: string;
  _id: string;
  description: string;
  user: TUser;
  transactionid: string;
  trxref: string;
};
