import React from "react";
import styles from "./Home.module.css";
import NavBar from "../NavBar";
import BubbleHome from "../BubbleHome";
import image from "../assets/back5.avif";

export default function Home() {
  return (
    <div className={styles.Home}>
      <img className={styles.background} src={image} />
      <div className={styles.headers}>
        <h1>Health.</h1>
        <h1>ServiceQ.</h1>
        <h1>Innovation.</h1>
      </div>
      <div className={styles.bubble}>
        <BubbleHome />
      </div>
    </div>
  );
}
