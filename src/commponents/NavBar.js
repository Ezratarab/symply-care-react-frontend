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
          const response = await authServiceInstance.getPatientByEmail(userStorage.sub);
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
      (response) => {
        console.log("LogOut successful");
        console.log("Response data:", response.data);
        navigate("/home");
        window.location.reload();
        console.log("LogOut successful");
        handleLoginLogout();
      },
      (error) => {
        console.error("LogOut error:", error);
        navigate("/LogIn");
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
        <ul className={styles.logo}>
          {isLogin && (
            <li>
              <Link>Your Profile {userName}</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
