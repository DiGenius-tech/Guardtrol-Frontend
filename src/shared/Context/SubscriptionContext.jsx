import { createContext } from "react";

export const SubscriptionContext = createContext({
    isSubscribed: false,
    currentSubscription: null,
    setCurrentSubscription: () => {}
    
  }) 