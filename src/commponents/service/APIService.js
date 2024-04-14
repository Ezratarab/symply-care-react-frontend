import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080";

const BASE_PATIENTS_URL = "http://localhost:8080/patients/";
const BASE_DOCTORS_URL = "http://localhost:8080/doctors/";
const DOCTORS_LIST_URL = "http://localhost:8080/doctors/doctors";
const DOCTORS_LIST_URL2 = "http://localhost:8080/doctors/fullDoctors";
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
  getAllDoctorsWithInquiries() {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(DOCTORS_LIST_URL2, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllPatients() {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(PATIENTS_LIST_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deletePatient(id) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.delete(`${DELETE_PATIENT_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPatientById(id) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(`${GET_PATIENT_ID_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPatientByEmail(email) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(`${GET_PATIENT_EMAIL_URL}${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getDoctorById(id) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(`${GET_DOCTOR_ID_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getDoctorByEmail(email) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    return axios.get(`${GET_DOCTOR_EMAIL_URL}${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updatePatientDetails(user) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.put(
        `${UPDATE_PATIENT_URL}${user.id}`,
        user,
        { headers }
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error updating patient details:", error);
      throw error;
    }
  }

  async sendAnswer(inquiryId, answer) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.put(
        `${BASE_DOCTORS_URL}answerInquiry/${inquiryId}`,
        answer,
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error answering inquiry:", error);
      throw error;
    }
  }

  async getAIAnswer(inquiryId) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.put(
        `${BASE_DOCTORS_URL}answerAI/${inquiryId}`,
        null, // Updated: Removed empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error answering inquiry:", error);
      throw error;
    }
  }

  async deletePatientAppointment(id) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.delete(
        `${BASE_PATIENTS_URL}deleteAppointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error deleting patient appointment:", error);
      throw error;
    }
  }

  async uploadImageForDoctor(user, formData) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.put(
        `${BASE_DOCTORS_URL}doctor/${user.id}/addImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error uploading doctor image:", error);
      throw error;
    }
  }

  async uploadImageForPatient(user, formData) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.put(
        `${BASE_PATIENTS_URL}patient/${user.id}/addImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error uploading doctor image:", error);
      throw error;
    }
  }

  async deleteDoctorAppointment(id) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.delete(
        `${BASE_DOCTORS_URL}deleteAppointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error deleting patient appointment:", error);
      throw error;
    }
  }

  async updateDoctorDetails(user) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    try {
      const response = await axios.put(`${UPDATE_DOCTOR_URL}${user.id}`, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Empty response or missing data");
      }
    } catch (error) {
      console.error("Error updating doctor details:", error);
      throw error;
    }
  }

  async addDoctorToPatient(patientID, doctor) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_PATIENTS_URL}patient/${patientID}/addDoctor`,
        doctor,
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Doctor To patient:", error);
      throw error;
    }
  }

  async addPatientToDoctor(doctorID, patient) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_DOCTORS_URL}doctor/${doctorID}/addPatient`,
        patient,
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Patient To Doctor:", error);
      throw error;
    }
  }

  async addInquiryToPatient(patient, doctor, description) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_PATIENTS_URL}patient/${patient.id}/addInquiry`,
        {
          doctor: doctor,
          patient: patient,
          symptoms: description,
        },
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Inquiry To Patient:", error);
      throw error;
    }
  }

  async addInquiryFromDoctorToPatient(doctor, patient, description) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_DOCTORS_URL}doctor/${doctor.id}/addInquiryToPatient`,
        {
          doctor: doctor,
          patient: patient,
          symptoms: description,
        },
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Inquiry From doctor to patient:", error);
      throw error;
    }
  }

  async addInquiryFromDoctorToDoctor(doctor, doctor2, description) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_DOCTORS_URL}doctor/${doctor.id}/addInquiryToDoctor`,
        {
          doctor: doctor,
          doctor2: doctor2,
          symptoms: description,
        },
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Inquiry From doctor to doctor:", error);
      throw error;
    }
  }

  async addAppointmentToPatient(patient, doctor, date) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.post(
        `${BASE_PATIENTS_URL}patient/${patient.id}/addAppointment`,
        {
          doctor: doctor,
          patient: patient,
          date: date,
        },
        { headers }
      );
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Appointment To patient:", error);
      throw error;
    }
  }

  async addAppointmentToDoctor(doctor, patient, date) {
    const token = JSON.parse(sessionStorage.getItem("user")).accessToken;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const appointment = {
        doctor: doctor,
        patient: patient,
        date: date,
      };
      const response = await axios.post(
        `${BASE_DOCTORS_URL}doctor/${doctor.id}/addAppointment`,
        appointment,
        { headers }
      );

      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error adding Appointment To doctor:", error);
      throw error;
    }
  }

  login(email, password) {
    return axios
      .post(`${API_URL}/login`, { email, password })
      .then((response) => {
        if (response.data.accessToken) {
          const decodedToken = jwtDecode(response.data.accessToken);
          const user = {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            roles: decodedToken.roles,
          };

          sessionStorage.setItem("user", JSON.stringify(user));
        }
        return response.data;
      });
  }
  signup(newUser, userType) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (userType === "Doctor") {
      return axios
        .post(`${SIGNUP_DOCTOR_URL}`, newUser, { headers })
        .then((response) => {
          console.log("success", response);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Sign up didn't succeed");
        });
    } else if (userType === "Patient") {
      console.log("it's patient");
      return axios
        .post(`${SIGNUP_PATIENT_URL}`, newUser, { headers })
        .then((response) => {
          console.log("success", response);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Sign up didn't succeed");
        });
    }
  }

  // helper method, Get refresh token from session storage
  getRefreshToken() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.refreshToken : null;
  }

  logout() {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user && user.accessToken && user.refreshToken) {
        sessionStorage.removeItem("user");
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
