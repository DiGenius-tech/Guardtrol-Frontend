import { TBeat } from "./beat";
import { TGuard } from "./guad";
import { TUser } from "./user";

export type TRole = {
  _id: string;
  organization: TUser;
  user: TUser;
  assignedBeats: TBeat[];
  name: string;
};
