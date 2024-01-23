import React, { useContext } from "react";
import styles from "./BubbleHome.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Context";

export default function BubbleHome() {
  const { isLogin } = useContext(UserContext);
  const navigate = useNavigate();

  function handleClickButtons() {
    isLogin ? navigate("/home") : navigate("/login");
  }

  return (
    <div className={styles.buttons}>
      <button onClick={handleClickButtons}>Schedule an appointment</button>
      <button onClick={handleClickButtons}>Change an appointment</button>
      <button onClick={handleClickButtons}>Test results</button>
      <button onClick={() => navigate("/doctors/doctors")}>Doctors</button>
    </div>
  );
}
