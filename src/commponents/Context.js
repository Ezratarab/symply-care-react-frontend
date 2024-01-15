import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    //request for server
    //get response
  }, []);

  return (
    <UserContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </UserContext.Provider>
  );
};
