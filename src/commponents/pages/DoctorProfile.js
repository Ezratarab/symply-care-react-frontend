import React, { useContext, useEffect, useState } from "react";
import styles from "./PatientProfile.module.css";
import { UserContext } from "../Context";
import authServiceInstance from "../service/APIService";
import authServicehelpers from "../service/AuthServiceHelpers";
import defaultImage from "../assets/user.png";
import APIService from "../service/APIService";
import AuthWrapper from "../service/AuthWrapper";

export default function DoctorProfile() {
  const { isLogin } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addDeleteAppointmentMode, setAddDeleteAppointmentMode] =
    useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [userType, setUserType] = useState("");

  const defaultState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    street: "",
    birthDay: "",
    newPatient: "",
    doctorText: "",
    patientText: "",
    newAppointmentDate: "",
    newAppointmentTime: "",
    selectedDoctorForMessage: "",
    selectedPatientForMessage: "",
    selectedPatientForAppointment: "",
    description: "",
    descriptionError: "",
    newAppointmentTimeError: "",
    newAppointmentDateError: "",
    selectedDoctorForMessageError: "",
    selectedPatientForMessageError: "",
    selectedPatientForAppointmentError: "",
    idError: "",
    firstNameError: "",
    lastNameError: "",
    newPatientError: "",
    emailError: "",
    cityError: "",
    countryError: "",
    streetError: "",
    birthDayError: "",
    doctorTextError: "",
    patientsTextError: "",
    hospitalError: "",
    specializationError: "",
    hmoError: "",
    experienceError: "",
    specialization: "",
    hospital: "",
    hmo: "",
    experience: "",
  };

  const buildUpdatedDoctor = (user) => {
    const newUser = {
      id: user.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: user.email,
      password: user.password,
      city: state.city,
      country: state.country,
      street: state.street,
      birthDay: state.birthDay,
      imageData: state.imageData,
      specialization: state.specialization,
      hospital: state.hospital,
      hmo: state.hmo,
      experience: state.experience,
      inquiriesList: user.inquiriesList,
      patients: user.patients,
      appointments: user.appointments,
    };
    console.log(newUser);
    return newUser;
  };

  const [state, setState] = useState(defaultState);

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;
    console.log(fieldName, ":  ", value);
    setState((prevState) => ({
      ...prevState,
      [fieldName]: value,
      [`${fieldName}Error`]: "",
    }));
  };

  const handleDoctorMessage = async () => {
    const selectedDoctor = state.selectedDoctorForMessage;
    const description = state.doctorText;
    console.log(doctorsList);
    console.log(state.selectedDoctorForMessage);
    if (selectedDoctor && description) {
      const selectedDoctor = doctorsList.find(
        (doctor) =>
          `${doctor.firstName} ${doctor.lastName}` ===
          state.selectedDoctorForMessage
      );
      try {
        const response = await APIService.addInquiryFromDoctorToDoctor(
          user,
          selectedDoctor,
          description
        );
        console.log(
          "Inquiry added successfully from doctor to doctor:",
          response
        );
        window.location.reload();
      } catch (error) {
        console.error("Error adding inquiry from doctor to doctor:", error);
      }
    } else {
      console.error("Please select a doctor and provide a description.");
    }
  };
  const handlePatientMessage = async () => {
    const selectedPatient = state.selectedPatientForMessage;
    const description = state.patientText;
    console.log(patientsList);
    console.log(state.selectedPatientForMessage);
    if (selectedPatient && description) {
      const selectedPatient = patientsList.find(
        (patient) =>
          `${patient.firstName} ${patient.lastName}` ===
          state.selectedPatientForMessage
      );
      console.log("--------", selectedPatient);
      try {
        const response = await APIService.addInquiryFromDoctorToPatient(
          user,
          selectedPatient,
          description
        );
        console.log(
          "Inquiry added successfully from doctor to patient:",
          response
        );
        window.location.reload();
      } catch (error) {
        console.error("Error adding inquiry from doctor to patient:", error);
      }
    } else {
      console.error("Please select a patient and provide a description.");
    }
  };

  const updateDoctor = async () => {
    const updateDoctor = buildUpdatedDoctor(user);
    console.log(updateDoctor);
    try {
      const response = await APIService.updateDoctorDetails(updateDoctor);
      console.log("Doctor details updated successfully:", response);
      setUser(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating doctor details:", error);
    }
  };

  const handleAddPatient = async () => {
    if (state.newPatient !== "") {
      const selectedPatient = patientsList.find(
        (patient) =>
          `${patient.firstName} ${patient.lastName}` === state.newPatient
      );
      console.log(selectedPatient.id);
      const isPatientAlreadyAdded = user.patients.some(
        (patient) => patient.id === selectedPatient.id
      );

      if (!isPatientAlreadyAdded) {
        try {
          const response = await APIService.addPatientToDoctor(
            user.id,
            selectedPatient
          );
          console.log(response);
          setState((prevState) => ({
            ...prevState,
            newPatient: "",
          }));
          window.location.reload();
        } catch (error) {
          console.error("Error adding patient to doctor:", error);
        }
      } else {
        console.log("Patient is already added to the doctors's list.");
      }
    }
  };

  const isEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          let response;
          if (userStorage.roles[0] === "PATIENT") {
            response = await authServiceInstance.getPatientByEmail(
              userStorage.sub
            );
            setUserType("Patient");
          } else if (userStorage.roles[0] === "DOCTOR") {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
            setUserType("Doctor");
          }
          if (response && userStorage.roles[0] === "DOCTOR") {
            const user = response.data;
            setUser(user);
            console.log(user);
            setState({
              id: user.id || "",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              city: user.city || "",
              country: user.country || "",
              street: user.street || "",
              birthDay: user.birthDay || "",
              specialization: user.specialization || "",
              hospital: user.hospital || "",
              hmo: user.hmo || "",
              experience: user.experience || "",
              ...defaultState,
            });
          } else {
            console.error("No response received for user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setState(defaultState);
      }
    }
    async function fetchDoctors() {
      try {
        const response = await APIService.getAllDoctors();
        setDoctorsList(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }
    async function fetchPatients() {
      try {
        const response = await APIService.getAllPatients();
        setPatientsList(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
    fetchPatients();
    fetchDoctors();
    getUser();
  }, [isLogin]);

  const handleDeleteAppointment = (index) => {
    setUser((prevUser) => {
      const updatedAppointments = [...prevUser.appointments];
      updatedAppointments.splice(index, 1); // Remove the appointment at the specified index
      return {
        ...prevUser,
        appointments: updatedAppointments,
      };
    });
  };

  const handleAddDeleteAppointment = async (event) => {
    console.log("came to here!");
    console.log(state.selectedPatientForAppointment);
    if (state.selectedPatientForAppointment !== "") {
      const selectedPatient = patientsList.find(
        (patient) =>
          `${patient.firstName} ${patient.lastName}` ===
          state.selectedPatientForAppointment
      );
      console.log(selectedPatient);
      const date = state.newAppointmentDate + " " + state.newAppointmentTime;
      console.log(user, selectedPatient, date);
      try {
        const response = await APIService.addAppointmentToDoctor(
          user,
          selectedPatient,
          date
        );
        console.log("Doctor appointment added successfully:", response);
        window.location.reload();
      } catch (error) {
        console.error("Error adding patient appointment:", error);
      }
    }
    setUser((prevUser) => ({
      ...prevUser,
      newAppointmentDate: "",
      newAppointmentTime: "",
    }));
    console.log(user.appointments);
  };

  const renderFormField = (fieldName, placeholder, type = "text") => (
    <div className={`form-floating mb-3 ${styles.formFloating}`}>
      <input
        type={type}
        className={`form-control ${styles.input} ${
          state[`${fieldName}Error`] ? styles.invalid : ""
        }`}
        id={`floating${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`}
        name={fieldName}
        placeholder={placeholder}
        value={state[fieldName] || ""}
        onChange={(event) => handleInputChange(event, fieldName)} // Modified onChange handler
      />

      <label
        htmlFor={`floating${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        }`}
      >
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
      </label>
      <span className={`text-danger ${styles.errorText}`}>
        {state[`${fieldName}Error`]}
      </span>
    </div>
  );

  return (
    <div className={styles.main}>
      <AuthWrapper>
        <div className={styles.right}>
          <div className={styles.title}>
            <div className={styles.profile}>
              <div className={styles.image}>
                {user && user.imageData ? (
                  <>
                    <img
                      src={`data:image/jpeg;base64,${user.imageData}`}
                      alt="User"
                      className={styles.profileImage}
                    />
                    <div className={styles.overlay}>
                      <span className={styles.overlay_text}>Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={defaultImage}
                      alt="Default User"
                      className={styles.profileImage}
                    />
                    <div className={styles.overlay}>
                      <span className={styles.overlay_text}>Change Image</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.name}>
                {user?.firstName ?? ""} {user?.lastName ?? ""}
              </div>
            </div>
            <h1>Have a good work!</h1>
          </div>
          <div className={styles.information}>
            <p>
              <span className={styles.label}>ID:</span>{" "}
              <span>{user?.id ?? ""}</span>
            </p>
            <p>
              <span className={styles.label}>First Name:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.firstNameError ? styles.invalid : ""
                  }`}
                  name="firstName"
                  placeholder={user.firstName}
                  value={state.firstName}
                  onChange={(event) => handleInputChange(event, "firstName")}
                />
              ) : (
                <span>{user?.firstName ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Last Name:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.lastNameError ? styles.invalid : ""
                  }`}
                  name="lastName"
                  placeholder={user.lastName}
                  value={state.lastName}
                  onChange={(event) => handleInputChange(event, "lastName")}
                />
              ) : (
                <span>{user?.lastName ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>email: </span>{" "}
              <span>{user?.email ?? ""}</span>
            </p>
            <p>
              <span className={styles.label}>City:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.cityError ? styles.invalid : ""
                  }`}
                  name="city"
                  placeholder={user.city}
                  value={state.city}
                  onChange={(event) => handleInputChange(event, "city")}
                />
              ) : (
                <span>{user?.city ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Country:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.countryError ? styles.invalid : ""
                  }`}
                  name="country"
                  placeholder={user.country}
                  value={state.country}
                  onChange={(event) => handleInputChange(event, "country")}
                />
              ) : (
                <span>{user?.country ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Street:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.streetError ? styles.invalid : ""
                  }`}
                  id={`floatingStreet`}
                  name="street"
                  placeholder={user.street}
                  value={state.street}
                  onChange={(event) => handleInputChange(event, "street")}
                />
              ) : (
                <span>{user?.street ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Birth Date:</span>{" "}
              {editMode ? (
                <input
                  type="date"
                  className={`form-control ${styles.input} ${
                    state.birthDayError ? styles.invalid : ""
                  }`}
                  name="birthDay"
                  placeholder={user.birthDay}
                  value={state.birthDay}
                  onChange={(event) => handleInputChange(event, "birthDay")}
                />
              ) : (
                <span>{user?.birthDay ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Specialization:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.specializationError ? styles.invalid : ""
                  }`}
                  name="specialization"
                  placeholder={user.specialization}
                  value={state.specialization}
                  onChange={(event) =>
                    handleInputChange(event, "specialization")
                  }
                />
              ) : (
                <span>{user?.specialization ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>Hospital:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.hospitalError ? styles.invalid : ""
                  }`}
                  name="hospital"
                  placeholder={user.hospital}
                  value={state.hospital}
                  onChange={(event) => handleInputChange(event, "hospital")}
                />
              ) : (
                <span>{user?.hospital ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>HMO:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.hmoError ? styles.invalid : ""
                  }`}
                  name="hmo"
                  placeholder={user.hmo}
                  value={state.hmo}
                  onChange={(event) => handleInputChange(event, "hmo")}
                />
              ) : (
                <span>{user?.hmo ?? ""}</span>
              )}
            </p>
            <p>
              <span className={styles.label}>experience:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  className={`form-control ${styles.input} ${
                    state.experienceError ? styles.invalid : ""
                  }`}
                  name="experience"
                  placeholder={user.experience}
                  value={state.experience}
                  onChange={(event) => handleInputChange(event, "experience")}
                />
              ) : (
                <span>{user?.experience ?? ""} Years</span>
              )}
            </p>
            <button
              onClick={() => {
                if (editMode) {
                  updateDoctor();
                }
                setEditMode((prevEditMode) => !prevEditMode);
              }}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className={styles.description}>
          <div>
            <p>You can send something to the doctor you want:</p>
            <select
              className={`form-select ${styles.input} ${
                state.selectedDoctorForMessageError ? styles.invalid : ""
              }`}
              id="floatingSelectedDoctorForMessage"
              name="selectedDoctorForMessage"
              value={state.selectedDoctorForMessage}
              onChange={(event) =>
                handleInputChange(event, "selectedDoctorForMessage")
              }
            >
              <option value="">Select an option</option>
              {user &&
                doctorsList &&
                doctorsList
                  .filter((doctor) => doctor.id !== user.id)
                  .map((doctor) => (
                    <option
                      key={doctor.id}
                      value={`${doctor.firstName} ${doctor.lastName}`}
                    >
                      To: {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
            </select>
            {renderFormField("doctorText", "Describe...", "text")}
            <button type="button" onClick={handleDoctorMessage}>
              Send
            </button>
          </div>
          <div>
            <p>You can send to your patients you want a message</p>
            <p>please choose a patient and describe your message:</p>
            <select
              className={`form-select ${styles.input} ${
                state.selectedPatientForMessage ? styles.invalid : ""
              }`}
              id="floatingSelectedPatientForMessage"
              name="selectedPatientForMessage"
              value={state.selectedPatientForMessage}
              onChange={(event) =>
                handleInputChange(event, "selectedPatientForMessage")
              }
            >
              <option value="">Select an option</option>
              {user &&
                user.patients &&
                user.patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={`${patient.firstName} ${patient.lastName}`}
                  >
                    To: {patient.firstName} {patient.lastName}
                  </option>
                ))}
            </select>

            {renderFormField("patientText", "Describe here...", "text")}
            <button type="button" onClick={handlePatientMessage}>
              send
            </button>
          </div>
          <div className={styles.inquiries}>
            <div>Here are your answered inquiries</div>
            {user?.inquiriesList?.map((inquiry, index) => {
              const patient = inquiry.hasAnswered
                ? patientsList.find((patient) =>
                patient.inquiriesList.some(
                      (patientInquiry) => patientInquiry.id === inquiry.id
                    )
                  )
                : null;
              return (
                <div key={index} className={styles.inquiry}>
                  {inquiry.hasAnswered ? <span>{`${inquiry.id}`}</span> : null}
                  <span>
                    {patient
                      ? `-   with Dr. ${patient.firstName} ${patient.lastName}`
                      : ""}
                  </span>
                </div>
              );
            })}
            {user?.inquiriesList?.every((inquiry) => !inquiry.hasAnswered) && (
              <p>No answered inquiries yet</p>
            )}
            <div>Here are your unanswered inquiries</div>
            {user?.inquiriesList?.map((inquiry, index) => {
              const patient = !inquiry.hasAnswered
                ? patientsList.find((patient) =>
                patient.inquiriesList.some(
                      (patientInquiry) => patientInquiry.id === inquiry.id
                    )
                  )
                : null;
              return (
                <div key={index} className={styles.inquiry}>
                  {!inquiry.hasAnswered ? <span>{`${inquiry.id}`}</span> : null}
                  <span>
                    {patient
                      ? `-   with Patient. ${patient.firstName} ${patient.lastName}`
                      : ""}
                  </span>
                </div>
              );
            })}
            {user?.inquiriesList?.every((inquiry) => inquiry.hasAnswered) && (
              <p>No unanswered inquiries yet</p>
            )}
          </div>

          <div className={styles.appointments}>
            <div>Here's your Scheduled appointments</div>
            {user?.appointments?.map((appointment, index) => {
              const patient = patientsList.find((patient) => {
                const patientAppointments = patient.appointments || [];
                return patientAppointments.some(
                  (patientAppointment) => patientAppointment.id === appointment.id
                );
              });
              return (
                <div key={index} className={styles.appointment}>
                  <span>{appointment.date ?? ""}</span>
                  <span>
                    {patient
                      ? `-   with Patient. ${patient.firstName} ${patient.lastName}`
                      : " --none"}
                  </span>
                  {addDeleteAppointmentMode && (
                    <div className={styles.appointmentsButtons}>
                      <button onClick={() => handleDeleteAppointment(index)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {addDeleteAppointmentMode ? (
              <>
                <select
                  className={`form-select ${styles.input} ${
                    state.selectedPatientForAppointmentError
                      ? styles.invalid
                      : ""
                  }`}
                  id="floatingSelectedPatientForAppointment"
                  name="selectedPatientForAppointment"
                  value={state.selectedPatientForAppointment}
                  onChange={(event) =>
                    handleInputChange(event, "selectedPatientForAppointment")
                  }
                >
                  <option value="">Select an option</option>
                  {user &&
                    user.patients &&
                    user.patients.map((patient) => (
                      <option
                        key={patient.id}
                        value={`${patient.firstName} ${patient.lastName}`}
                      >
                        With: {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                </select>
                <form className={styles.newAppointment}>
                  {renderFormField(
                    "newAppointmentDate",
                    "Appointment Date",
                    "Date"
                  )}
                  {renderFormField(
                    "newAppointmentTime",
                    "Appointment Time",
                    "Time"
                  )}
                  <button type="button" onClick={handleAddDeleteAppointment}>
                    Add
                  </button>
                  <button onClick={() => setAddDeleteAppointmentMode(false)}>
                    Done
                  </button>
                </form>
              </>
            ) : (
              <button onClick={() => setAddDeleteAppointmentMode(true)}>
                Add / Delete Appointment
              </button>
            )}
          </div>
          <div className={styles.addDoctors}>
            <p>If you want To add Patients, please select Patient:</p>
            <select
              className={`form-select ${styles.input} ${
                state.newPatient ? styles.invalid : ""
              }`}
              id="floatingNewPatient"
              name="newPatient"
              value={state["newPatient"]}
              onChange={(event) => handleInputChange(event, "newPatient")}
            >
              <option value="">Select a Patient</option>
              {user &&
                patientsList &&
                patientsList.map((patient) => (
                  <option
                    key={patient.id}
                    value={`${patient.firstName} ${patient.lastName}`}
                  >
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
            </select>

            <button onClick={handleAddPatient}>Add Patient</button>
          </div>
        </div>
      </AuthWrapper>
    </div>
  );
}
