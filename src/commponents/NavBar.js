import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <div>
      <div className={styles.navBar}>
        <ul className={styles.logo}>
          <li>
            <Link to="/home">
              SYMPly-Care
            </Link>
          </li>
        </ul>
        <ul className={styles.others}>
          <li>
            <Link to="/login">Log-In</Link>
          </li>
          <li>
            <Link to="/signup">Sign-Up</Link>
          </li>
          <li>
            <Link to="/doctors/doctors">Our Doctors</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
