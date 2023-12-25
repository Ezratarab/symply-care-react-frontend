import React from "react";
import styles from "./BubbleHome.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function BubbleHome() {
  return (
    <div className={styles.buttons}>
      <button> Schedule an appointment</button>
      <button>Change an appointment</button>
      <button>Test results</button>
      <button>Doctors</button>
    </div>
  );
}
