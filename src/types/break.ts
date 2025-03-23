import { TUser } from "./user";
import { TBeat } from "./beat";

export type TBreak = {
  _id: string;
  name: string;
  minutes: number;
  beat: string | TBeat;
  user: string | TUser;
  createdAt: string;
  updatedAt: string;
};