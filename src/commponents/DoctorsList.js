import React from "react";
import APIService from "./service/APIService";
import { useState, useEffect } from "react";

export default function DoctorsList() {
  const [doctorsArray, setDoctorsArray] = useState([]);

  useEffect(() => {
    getAllDoctors();
  }, []);

  function getAllDoctors() {
    APIService.getAllDoctors()
      .then((res) => {
        setDoctorsArray(res.data);
        console.log(res);
      })
      .catch((e) => console.log(e));
  }
  return (
    <div>
      <h1>DoctorsList</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Emailllll</th>
          </tr>
        </thead>
        <tbody>
          {doctorsArray.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.firstName}</td>
              <td>{doctor.lastName}</td>
              <td>{doctor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
