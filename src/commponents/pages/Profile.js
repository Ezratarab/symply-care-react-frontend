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
          let response; // Define response variable outside the if-else blocks
          if (userStorage.roles[0] === "PATIENT") {
            response = await authServiceInstance.getPatientByEmail(
              userStorage.sub
            );
          } else if (userStorage.roles[0] === "DOCTOR") {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
          }
          if (response) {
            // Check if response is not null before accessing data
            const user = response.data;
            setUser(user);
          } else {
            console.error("No response received for user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser();
      }
    }
    getUser();
  }, [isLogin]);

  return (
    <div className={styles.main}>
      <div className={styles.right}>
        <div className={styles.title}>
          <div className={styles.profile}>
            <div className={styles.image}>
              {user && user.imageData && (
                <img
                  src={`data:image/jpeg;base64,${user.imageData}`}
                  alt="User"
                  className={styles.profileImage}
                />
              )}
            </div>
            <div className={styles.name}>
              {user?.firstName ?? ""} {user?.lastName ?? ""}
            </div>
          </div>
          <h1>We hope you are feeling well.</h1>
        </div>
        <div className={styles.information}>
          <p>
            <span>ID:</span> <input type="text" value={user?.id ?? ""} />{" "}
            <button>Update</button>
          </p>
          <p>
            <span>First Name:</span>{" "}
            <input type="text" value={user?.firstName ?? ""} />
          </p>
          <p>
            <span>Last Name:</span>{" "}
            <input type="text" value={user?.lastName ?? ""} />
          </p>
          <p>
            <span>Email:</span> <input type="text" value={user?.email ?? ""} />
          </p>
          <p>
            <span>City:</span> <input type="text" value={user?.city ?? ""} />
          </p>
          <p>
            <span>Country:</span>{" "}
            <input type="text" value={user?.country ?? ""} />
          </p>
          <p>
            <span>Street:</span>{" "}
            <input type="text" value={user?.street ?? ""} />
          </p>
          <p>
            <span>Birth Date:</span>{" "}
            <input type="text" value={user?.birthDay ?? ""} />
          </p>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.testResults}>
          <div>Here's your Test Results</div>
          <div>{user?.testResults ?? ""}</div>
        </div>
        <div className={styles.appointments}>
          <div>Here's your Scheduled appointments</div>
          {user?.appointments?.map((appointment, index) => (
            <div key={index}>{appointment.date ?? ""}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
