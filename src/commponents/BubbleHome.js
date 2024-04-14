import React, { useContext, useEffect, useState } from "react";
import styles from "./BubbleHome.module.css";
import { useNavigate } from "react-router-dom";
import authServiceInstance from "./service/APIService";
import { URLsContext, UserContext } from "./Context";
import authServicehelpers from "./service/AuthServiceHelpers";

export default function BubbleHome() {
  const { isLogin } = useContext(UserContext);
  const { PATIENT_PROFILE_URL, DOCTOR_PROFILE_URL } = useContext(URLsContext);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          setUserRoles(userStorage.roles);
          let response; // Define response variable outside the if-else blocks
          if (userStorage.roles[0] === "ROLE_PATIENT") {
            response = await authServiceInstance.getPatientByEmail(
              userStorage.sub
            );
          } else if (userStorage.roles[0] === "ROLE_DOCTOR") {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
          }
          if (response) {
            // Check if response is not null before accessing data
            const user = response.data;
            setUserId(user.id);
          } else {
            console.error("No response received for user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserId("");
      }
    }
    getUser();
  }, [isLogin]);

  function handleClickButtons() {
    if (isLogin) {
      if (userRoles.length === 1) {
        if (userRoles[0] === "ROLE_PATIENT") {
          navigate(`${PATIENT_PROFILE_URL}${userId}`);
        } else if (userRoles[0] === "ROLE_DOCTOR") {
          navigate(`${DOCTOR_PROFILE_URL}${userId}`);
        }
      }
    } else {
      navigate("/login");
    }
  }

  return (
    <div className={styles.buttons}>
      <button onClick={handleClickButtons}>Schedule an appointment</button>
      <button onClick={handleClickButtons}>Ask A doctor</button>
      <button onClick={handleClickButtons}>Test results</button>
      <button onClick={handleClickButtons}>Your Profile</button>
    </div>
  );
}
