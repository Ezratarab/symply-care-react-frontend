import React, { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { UserContext } from "../Context";
import authServiceInstance from "../service/APIService";
import authServicehelpers from "../service/AuthServiceHelpers";

export default function Profile() {
  const { isLogin } = useContext(UserContext);
  const [user, setUser] = useState(null); // Change initial state to null

  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          const response = await authServiceInstance.getPatientByEmail(
            userStorage.sub
          );
          const userData = response.data; // Rename to avoid conflict with setUser
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null); // Set user to null if not logged in
      }
    }
    getUser();
  }, [isLogin]);

  // Conditional rendering to handle user being null or undefined
  if (!user) {
    return <div>Loading...</div>; // Placeholder while user data is fetched
  }

  return (
    <div className={styles.main}>
      <div className={styles.right}>
        <div className={styles.title}>
          <div className={styles.profile}>
            <div className={styles.image}>
              <img
                src={`data:image/jpeg;base64,${user.imageData}`}
                alt="User"
                className={styles.profileImage}
              />
            </div>
            <div className={styles.name}>
              {user.firstName} {user.lastName}
            </div>
          </div>
          <h1>We hope you are feeling well.</h1>
        </div>
        <div className={styles.information}>
          <div>ID: {user.id} </div>
          <div>first name: {user.firstName} </div>
          <div>last name: {user.lastName} </div>
          <div>email: {user.email} </div>
          <div>country: {user.country} </div>
          <div>city: {user.city} </div>
          <div>street: {user.street} </div>
          <div>birtDate: {user.birthDay} </div>
        </div>
      </div>
      <div className={styles.description}>
      <div className={styles.testResults}>
        <div>Here's your Test Results</div>
        <div>{user.testResults}</div>
      </div>
      <div className={styles.appointments}>
        <div>Here's your Scheduled appointments</div>
        {user.appointments.map((appointment, index) => (
            <div key={index}>{appointment.date}</div>
          ))}
      </div>
      </div>
    </div>
  );
}
