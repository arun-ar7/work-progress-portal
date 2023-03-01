import React, { createContext, useContext } from "react";
import { useUser } from "../custom/CustomStates";

const ValueContext = createContext();

export const UserValueProvider = ({ children }) => {
  //states
  const [user, dispatchUser] = useUser();
  return (
    <ValueContext.Provider value={{ user, dispatchUser }}>
      {children}
    </ValueContext.Provider>
  );
};

export default ValueContext;
export const useUserContext = () => useContext(ValueContext);
