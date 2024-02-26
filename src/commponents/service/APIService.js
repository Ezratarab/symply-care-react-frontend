import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080";

const BASE_PATIENTS_URL = "http://localhost:8080/patients/";
const BASE_DOCTORS_URL = "http://localhost:8080/doctors/";
const DOCTORS_LIST_URL = "http://localhost:8080/doctors/doctors";
const PATIENTS_LIST_URL = "http://localhost:8080/patients/patients";
const DELETE_PATIENT_URL = "http://localhost:8080/patients/deletePatient/";
const GET_PATIENT_ID_URL = "http://localhost:8080/patients/patient/I";
const GET_PATIENT_EMAIL_URL = "http://localhost:8080/patients/patient/E";
const GET_DOCTOR_ID_URL = "http://localhost:8080/doctors/doctor/I";
const GET_DOCTOR_EMAIL_URL = "http://localhost:8080/doctors/doctor/E";
const SIGNUP_DOCTOR_URL = "http://localhost:8080/doctors/addDoctor";
const SIGNUP_PATIENT_URL = "http://localhost:8080/patients/addPatient";
const UPDATE_PATIENT_URL = "http://localhost:8080/patients/updatePatient/";
const UPDATE_DOCTOR_URL = "http://localhost:8080/doctors/updateDoctor/";

class APIService {
  getAllDoctors() {
    return axios.get(DOCTORS_LIST_URL);
  }

  getAllPatients() {
    return axios.get(PATIENTS_LIST_URL);
  }

  deletePatient(id) {
    console.log("hi");
    return axios.delete(`${DELETE_PATIENT_URL}${id}`);
  }
  getPatientById(id) {
    return axios.get(`${GET_PATIENT_ID_URL}${id}`);
  }
  getPatientByEmail(email) {
    return axios.get(`${GET_PATIENT_EMAIL_URL}${email}`);
  }
  getDoctorById(id) {
    return axios.get(`${GET_DOCTOR_ID_URL}${id}`);
  }
  getDoctorByEmail(email) {
    return axios.get(`${GET_DOCTOR_EMAIL_URL}${email}`);
  }
  async updatePatientDetails(user) {
    const headers = {
      'Content-Type': 'application/json',
    };
    console.log("came to here with: ", {user});
    try {
      const response = await axios.put(`${UPDATE_PATIENT_URL}${user.id}`, user, { headers });
  
      if (response && response.data) {
        return response.data; 
      } else {
        throw new Error('Empty response or missing data');
      }
    } catch (error) {
      console.error('Error updating patient details:', error);
      throw error; 
    }
  }
  
  async addDoctorToPatient(patientID,doctorID) {
    console.log(doctorID);
    try {
      const response = await axios.post(`${BASE_PATIENTS_URL}patient/${patientID}/addDoctor`, doctorID);
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error adding Doctor To patient:', error);
      throw error; 
    }
  }
  async addPatientToDoctor(doctorID,patientID) {
    console.log(doctorID);
    try {
      const response = await axios.post(`${BASE_DOCTORS_URL}doctor/${doctorID}/addPatient`, patientID);
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error adding Patient To Doctor:', error);
      throw error; 
    }
  }

  async addAppointmentToPatient(patientID,doctorID,date) {
    try {
      const response = await axios.post(`${BASE_PATIENTS_URL}patient/${patientID}/addAppointment`, {doctorID}, {date});
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error adding Appointment To patient:', error);
      throw error; 
    }
  }
  async addAppointmentToDoctor(doctorID,patientID,date) {
    try {
      const response = await axios.post(`${BASE_DOCTORS_URL}doctor/${doctorID}/addAppointment`, {patientID}, {date});
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error adding Appointment To Doctor:', error);
      throw error; 
    }
  }
  
  login(email, password) {
    return axios
      .post(`${API_URL}/login`, { email, password })
      .then((response) => {
        if (response.data.accessToken) {
          // Decode the token to get user details and roles
          const decodedToken = jwtDecode(response.data.accessToken);
          const user = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            roles: decodedToken.roles,
          };

          // Save the user object to local storage
          localStorage.setItem("user", JSON.stringify(user));
        }
        return response.data;
      });
  }
  signup(newUser, userType) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (userType === "Doctor") {
      return axios
        .post(`${SIGNUP_DOCTOR_URL}`, { newUser },{headers})
        .then((response) => {
          if (response.data.accessToken) {
            // Decode the token to get user details and roles
            const decodedToken = jwtDecode(response.data.accessToken);
            const user = {
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              roles: decodedToken.roles,
            };

            // Save the user object to local storage
            localStorage.setItem("user", JSON.stringify(user));
          }
          return response.data;
        });
    } else if (userType === "Patient") {
      console.log("its patient");
      return axios
        .post(`${SIGNUP_PATIENT_URL}`, { newUser },{headers})
        .then((response) => {
          if (response.data.accessToken) {
            // Decode the token to get user details and roles
            const decodedToken = jwtDecode(response.data.accessToken);
            const user = {
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              roles: decodedToken.roles,
            };

            // Save the user object to local storage
            localStorage.setItem("user", JSON.stringify(user));
          }
          return response.data;
        });
    }
  }

  // helper method, Get refresh token from local storage
  getRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.refreshToken : null;
  }

  logout() {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.accessToken && user.refreshToken) {
        localStorage.removeItem("user");
        axios
          .post(`${API_URL}/logout`, null, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          })
          .then((response) => {
            console.log("Logged out successfully");
            resolve(response); // Resolve the promise with the response
          })
          .catch((error) => {
            console.error("Logout error:", error);
            reject(error); // Reject the promise with the error
          });
      } else {
        reject(new Error("User information not found"));
      }
    });
  }

  
}
const authServiceInstance = new APIService(); // Create an instance of AuthServiceAxios
export default authServiceInstance; // Export the instance as the default export
