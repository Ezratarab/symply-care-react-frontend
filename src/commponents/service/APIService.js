import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const API_URL = 'http://localhost:8080';

const DOCTORS_LIST_URL = "http://localhost:8080/doctors/doctors";
const PATIENTS_LIST_URL = "http://localhost:8080/patients/patients";
const DELETE_PATIENT_URL = "http://localhost:8080/patients/deletePatient/";
const GET_PATIENT_ID_URL = "http://localhost:8080/patients/patient/I";
const GET_PATIENT_EMAIL_URL = "http://localhost:8080/patients/patient/E";
const GET_DOCTOR_ID_URL = "http://localhost:8080/doctors/doctor/I";
const GET_DOCTOR_EMAIL_URL = "http://localhost:8080/doctors/doctor/E";

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
    getPatientById(id){
        return axios.get(`${GET_PATIENT_ID_URL}${id}`)
    }
    getPatientByEmail(email){
        return axios.get(`${GET_PATIENT_EMAIL_URL}${email}`)
    }
    getDoctorById(id){
        return axios.get(`${GET_DOCTOR_ID_URL}${id}`)
    }
    getDoctorByEmail(email){
        return axios.get(`${GET_DOCTOR_EMAIL_URL}${email}`)
    }
    login(email, password) {
        return axios
            .post(`${API_URL}/login`, {email, password})
            .then((response) => {
                if (response.data.accessToken) {
                    // Decode the token to get user details and roles
                    const decodedToken = jwtDecode(response.data.accessToken);
                    const user = {
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        roles: decodedToken.roles
                    };

                    // Save the user object to local storage
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return response.data;
            });
    }

    // helper method, Get refresh token from local storage
    getRefreshToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.refreshToken : null;
    }

    logout() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken && user.refreshToken) {
            localStorage.removeItem('user');
            axios.post(`${API_URL}/logout`, null, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
                .then(response => {
                    console.log('Logged out successfully');
                })
                .catch(error => {
                    console.error('Logout error:', error);
                });
        }
    }

}
const authServiceInstance = new APIService(); // Create an instance of AuthServiceAxios
export default authServiceInstance;  // Export the instance as the default export

