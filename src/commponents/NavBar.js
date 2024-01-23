import React, { useContext } from "react";
import { Link, useNavigate, } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "./assets/symply_care_new.png";
import authServiceInstance from "./service/APIService";
import { UserContext } from "./Context";

export default function NavBar() {
  const { isLogin, setIsLogin } = useContext(UserContext);
  const navigate = useNavigate();
  
  function handleLogOut(){
    authServiceInstance.logout()
    .then(
      (response) => {

          console.log('LogOut successful')
          console.log('Response data:', response.data);
          navigate('/home');
          window.location.reload();
          console.log('LogOut successful');
          handleLoginLogout()
      },
      (error) => {
          console.error('LogOut error:', error);
          navigate('/LogIn');
      }
  );
  }

  function handleLoginLogout() {
    // Assuming isLogin is a boolean indicating whether the user is logged in or not
    setIsLogin(!isLogin); // Toggle the login state
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
              <Link onClick={handleLogOut}>
                Log-Out
              </Link>
            ) : (
              <Link to="/login">
                Log-In
              </Link>
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
