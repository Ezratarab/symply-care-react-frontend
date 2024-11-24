import React from "react";
import styles from "./Home.module.css";
import NavBar from "../NavBar";
import BubbleHome from "../BubbleHome";
import image from "../assets/image2.png";

export default function Home() {
  return (
    <div className={styles.Home}>
      <img className={styles.background} src={image} />
      <div className={styles.headers}>
        <h1>Experience future of healthcare with SYMPly-Care!</h1>
        <h3>
          Predict diseases by symptoms with quick access to online doctors for
          advice, prescriptions, and medical notes. Proactive healthcare,
          simplified.
        </h3>
      </div>
      <div className={styles.bubble}>
        <BubbleHome />
      </div>
    </div>
  );
}
