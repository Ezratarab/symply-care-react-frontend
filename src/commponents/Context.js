import React, { createContext, useEffect, useState } from "react";
import AuthServiceHelpers from "./service/AuthServiceHelpers"; // Make sure to import AuthServiceHelpers or adjust the import path

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const currentUser = AuthServiceHelpers.getCurrentUser();
    setIsLogin(Boolean(currentUser));
  }, []);
  return (
    <UserContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </UserContext.Provider>
  );
};
