import React, { createContext, useEffect, useState } from "react";
import AuthServiceHelpers from "./service/AuthServiceHelpers"; 

export const UserContext = createContext();
export const URLsContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const currentUser = AuthServiceHelpers.getCurrentUser();
    setIsLogin(Boolean(currentUser));
  }, []);

  const PATIENT_PROFILE_URL = "/patients/patient/";
  const DOCTOR_PROFILE_URL = "/doctors/doctor/";

  return (
    <UserContext.Provider value={{ isLogin, setIsLogin }}>
      <URLsContext.Provider value={{ PATIENT_PROFILE_URL, DOCTOR_PROFILE_URL }}>
        {children}
      </URLsContext.Provider>
    </UserContext.Provider>
  );
};
