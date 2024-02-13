import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "./assets/symply_care_new.png";
import authServiceInstance from "./service/APIService";
import { UserContext } from "./Context";
import authServicehelpers from "./service/AuthServiceHelpers";

export default function NavBar() {
  const { isLogin, setIsLogin } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          let response;
          if (userStorage.roles[0] === "PATIENT") {
            response = await authServiceInstance.getPatientByEmail(
              userStorage.sub
            );
          } else if (userStorage.roles[0] === "DOCTOR") {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
          }
          const user = response.data;
          setUserName(user.firstName);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName("");
      }
    }
    getUser();
  }, [isLogin]);

  function handleLogOut() {
    authServiceInstance.logout().then(
      () => {
        console.log("LogOut successful");
        handleLoginLogout(); // Update the login/logout state
        navigate("/home"); // Navigate to the home page
        window.location.reload(); // Reload the window (optional)
      },
      (error) => {
        console.error("LogOut error:", error);
        navigate("/login"); // Navigate to the login page if logout fails
        window.location.reload();
      }
    );
  }

  function handleLoginLogout() {
    setIsLogin(!isLogin);
  }

  return (
    <div>
      <div className={styles.navBar}>
        <ul className={styles.logo}>
          <li>
            <Link to="/home">
              <img src={logo} alt="Symply Care Logo" width="150" height="50" />
            </Link>
          </li>
        </ul>
        <ul className={styles.others}>
          <li>
            {isLogin ? (
              <Link onClick={handleLogOut}>Log-Out</Link>
            ) : (
              <Link to="/login">Log-In</Link>
            )}
          </li>
          <li>
            <Link to="/doctors/doctors">Our Doctors</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/contactus">Contact Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
