import React from "react";
import APIService from "./service/APIService";
import { useParams } from "react-router-dom";

export default function DeletePatient() {
  const { idString } = useParams();
  console.log(idString);
  //APIService.deletePatient(id);

  console.log(`Fetching employee with ID: ${idString}`);

  return (
    <div>
      <h1>Deleted Patient with id {idString}</h1>
    </div>
  );
}
