import { TBeat } from "./beat";
import { TUser } from "./user";

export type TGuard = {
  name: string;
  _id: string;
  phone: number;
  user: TUser;
  beat: TBeat;
};
