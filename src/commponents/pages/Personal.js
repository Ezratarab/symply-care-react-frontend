import React from "react";
import styles from "./Personal.module.css";

export default function Personal(props) {
  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <div>Hello {props.firstName}! </div>
        <h1>We hope you are feeling well.</h1>
      </div>
      <div className={styles.description}>
        <div>Heres your Test Results</div>
        <div>{props.testResults}</div>
      </div>
      <div className={styles.description}>
        <div>Heres your Scheduled appointments</div>
        <div>{props.appointments} </div>
      </div>
    </div>
  );
}
