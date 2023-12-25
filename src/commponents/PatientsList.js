import React from "react";
import APIService from "./service/APIService";
import { useState, useEffect } from "react";

export default function PatientList() {
  const [patientsArray, setPatientsArray] = useState([]);

  useEffect(() => {
    getAllPatients();
  }, []);

  function getAllPatients() {
    APIService.getAllPatients()
      .then((res) => {
        setPatientsArray(res.data);
        console.log(res);
      })
      .catch((e) => console.log(e));
  }
  return (
    <div>
      <h1>PatientsList</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {patientsArray.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{patient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
