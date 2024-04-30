import { TGuard } from "./guad";
import { TUser } from "./user";

export type TBeat = {
  name: string;
  description: string;
  _id: string;
  user: TUser;
  guards: TGuard[];
};
