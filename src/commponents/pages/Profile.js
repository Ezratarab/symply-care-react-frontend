import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { UserContext } from "../Context";
import authServiceInstance from "../service/APIService";
import authServicehelpers from "../service/AuthServiceHelpers";

export default function Profile() {
  const { isLogin } = useContext(UserContext);
  const [user, setUser] = useState("");

  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          const response = await authServiceInstance.getPatientByEmail(
            userStorage.sub
          );
          const user = response.data;
          setUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser("");
      }
    }
    getUser();
  }, [isLogin]);

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <div>Hello {user.firstName} {user.lastName}! </div>
        <h1>We hope you are feeling well.</h1>
      </div>
      <div className={styles.description}>
        <div>Heres your Test Results</div>
        <div>{user.testResults}</div>
      </div>
      <div className={styles.description}>
        <div>Heres your Scheduled appointments</div>
        <div>{user.appointments} </div>
      </div>
    </div>
  );
}
