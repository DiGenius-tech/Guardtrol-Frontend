import { TGuard } from "./guad";
import { TPoint } from "./point";
import { TUser } from "./user";

export type TPatrol = {
  name: string;
  user: string;
  _id: string;
  points: Array<TPoint>;
};
