import { createContext } from "react";

export const MembershipContext = createContext({
    fwConfig: null,
    psConfig: null,
    init: ()=> {}
    
  }) 