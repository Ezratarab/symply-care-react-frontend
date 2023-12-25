import React from 'react'
import axios from 'axios';

const DOCTORS_LIST_URL = "http://localhost:8080/doctors/doctors";
const PATIENTS_LIST_URL = "http://localhost:8080/patients/patients";
const DELETE_PATIENT_URL = "http://localhost:8080/patients/deletePatient";



class APIService {
    
    getAllDoctors(){
        return axios.get(DOCTORS_LIST_URL);
    }

    getAllPatients(){
        return axios.get(PATIENTS_LIST_URL);
    }

    deletePatient(id){
        console.log("hi");
        return axios.delete(`${DELETE_PATIENT_URL}${id}`);
    }

}

export default new APIService();
