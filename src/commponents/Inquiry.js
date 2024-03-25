import React, { useState } from "react";
import styles from "./Inquiry.module.css";

export default function Inquiry({ inquiry, patient, doctor }) {
  const [showTextInput, setShowTextInput] = useState(false);
  const [answerText, setAnswerText] = useState("");

  const handleAnswerButtonClick = () => {
    setShowTextInput(true);
  };

  const handleSendClick = () => {
    // Handle sending answer logic here
    console.log("Sending answer:", answerText);
    setShowTextInput(false);
    setAnswerText("");
  };

  const handleSendToAI = () => {
    // Handle sending to AI logic here
    console.log("Sending to AI:", answerText);
    setShowTextInput(false);
    setAnswerText("");
  };

  return (
    <div className={styles.inquiry}>
      <span>{`${inquiry.id}`}</span>
      <span>
        {patient
          ? `-   with Patient. ${patient.firstName} ${patient.lastName}`
          : ""}
      </span>
      <span>
        {doctor
          ? `-   with Doctor. ${doctor.firstName} ${doctor.lastName}`
          : ""}
      </span>
      {inquiry.hasAnswered && <div>Answer: {inquiry.answer} </div>}
      {!inquiry.hasAnswered && !showTextInput && (
        <div className={styles.inquiriesButtons}>
          <button onClick={handleAnswerButtonClick}>Answer</button>
        </div>
      )}
      {!inquiry.hasAnswered && showTextInput && (
        <div>
          <p>Symptom: {inquiry.symptoms}</p>
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button onClick={handleSendClick}>Send</button>
          <button onClick={handleSendToAI}>Send to AI</button>
        </div>
      )}
    </div>
  );
}
