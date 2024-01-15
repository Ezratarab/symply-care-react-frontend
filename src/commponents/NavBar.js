import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useState } from "react";
import logo from "./assets/symply_care_new.png";
import { UserContext } from "./Context";

export default function NavBar() {
  const { isLogin } = useContext(UserContext);
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
            <Link to="/login">Log-In</Link>
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
