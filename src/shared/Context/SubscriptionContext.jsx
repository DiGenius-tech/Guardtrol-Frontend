import { createContext } from "react";

export const SubscriptionContext = createContext({
    isSubscribed: true,
    maxBeat: 2,
    extraGuards: 0,
    
  })