import { TBeat } from "./beat";
import { TGuard } from "./guad";
import { TSubscription } from "./subscription";

export type TUser = {
  name: string;
  email: string;
  emailverified: boolean;
  temporarycode?: number | null;
  password?: string;
  phone?: number;
  image?: string;
  resetToken?: string | null;
  resetTokenExpiration?: Date | null;
  clientid: string;
  onboardingcomplete: boolean;
  subscriptions: TSubscription["_id"][];
  beats: TBeat["_id"][];
  guards: TGuard["_id"][];
};
