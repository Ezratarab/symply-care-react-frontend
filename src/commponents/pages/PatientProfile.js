import React, { useContext, useEffect, useState } from "react";
import styles from "./PatientProfile.module.css";
import { UserContext } from "../Context";
import authServiceInstance from "../service/APIService";
import authServicehelpers from "../service/AuthServiceHelpers";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-date-picker";
import APIService from "../service/APIService";

export default function PatientProfile() {
  const { isLogin } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addDeleteAppointmentMode, setAddDeleteAppointmentMode] =
    useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [initialUserState, setInitialUserState] = useState(null);

  const defaultState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    street: "",
    birthDay: "",
    newDoctor: "",
    inquiriesList: "",
    selectedDoctor: "",
    inquiriesListError: "",
    newAppointmentDate: "",
    newAppointmentTime: "",
    newAppointmentTimeError: "",
    newAppointmentDateError: "",
    idError: "",
    firstNameError: "",
    selectedDoctorError: "",
    lastNameError: "",
    newDoctorError: "",
    emailError: "",
    cityError: "",
    countryError: "",
    streetError: "",
    birthDayError: "",
    doctors: "",
    doctorsError: "",
  };

  const buildUpdatedPatient = (user) => {
    const newUser = {
      id: user.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: user.email,
      password: state.password,
      city: state.city,
      country: state.country,
      street: state.street,
      birthDay: state.birthDay,
      imageData: state.imageData,
      inquiriesList: user.inquiriesList,
      doctors: user.doctors,
      appointments: user.appointments,
    };
    console.log(newUser);
    return newUser;
  };

  const [state, setState] = useState(defaultState);

  const handleInputChange = (event, fieldName) => {
    console.log(state.userType);
    const { value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [fieldName]: value,
      [`${fieldName}Error`]: "",
    }));
  };
  const handleSelectChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      newDoctor: event.target.value,
    }));
  };

  const handleAddDoctor = async () => {
    if (state.newDoctor !== "") {
      const selectedDoctor = doctorsList.find(
        (doctor) => `${doctor.firstName} ${doctor.lastName}` === state.newDoctor
      );
      console.log(user.id, selectedDoctor.id);
      const response = await APIService.addDoctorToPatient(
        user.id,
        selectedDoctor.id
      );
      console.log(response);
      setState((prevState) => ({
        ...prevState,
        newDoctor: "",
      }));
    }
  };
  const updatePatient = async () => {
    console.log("hi");
    const updatedPatient = buildUpdatedPatient(user);
    try {
      const response = await APIService.updatePatientDetails(updatedPatient);
      console.log("Patient details updated successfully:", response);
      setUser(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating patient details:", error);
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
          } else if (userStorage.roles[0] === "DOCTOR") {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
          }
          if (response) {
            const user = response.data;
            setUser(user);
            setDoctors(user.doctors);
            setInitialUserState(user);
            console.log(user.doctors);
            console.log(user);
            setState({
              id: user.id || "",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              city: user.city || "",
              country: user.country || "",
              street: user.street || "",
              birthDate: user.birthDay || "",
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
    console.log(state.selectedDoctor);
    if (state.selectedDoctor !== "") {
      const selectedDoctor = doctorsList.find(
        (doctor) =>
          `${doctor.firstName} ${doctor.lastName}` === state.selectedDoctor
      );
      console.log(selectedDoctor);
      const date = state.newAppointmentDate + " " + state.newAppointmentTime;
      console.log(user, selectedDoctor, date);
      try {
        const response = await APIService.addAppointmentToPatient(
          user,
          state.selectedDoctor,
          date
        );
        console.log("Patient appointment added successfully:", response);
        setUser(response.data);
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
      <div className={styles.right}>
        <div className={styles.title}>
          <div className={styles.profile}>
            <div className={styles.image}>
              {user && user.imageData && (
                <img
                  src={`data:image/jpeg;base64,${user.imageData}`}
                  alt="User"
                  className={styles.profileImage}
                />
              )}
            </div>
            <div className={styles.name}>
              {user?.firstName ?? ""} {user?.lastName ?? ""}
            </div>
          </div>
          <h1>We hope you are feeling well.</h1>
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
          <button
            onClick={() => {
              if (editMode) {
                if (!isEqual(initialUserState, state)) {
                  updatePatient();
                }
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
          <p>
            You can send to the doctor you want the decription of your disease
          </p>
          <p>please choose a doctor and explain your symptoms:</p>
          <select
            className={`form-select ${styles.input} ${
              state.selectedDoctorError ? styles.invalid : ""
            }`}
            id="floatingSelectedDoctor"
            name="selectedDoctor"
            value={state.selectedDoctor}
            onChange={(event) => handleInputChange(event, "selectedDoctor")}
          >
            <option value="">Select an option</option>
            {user &&
              doctors &&
              doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={`${doctor.firstName} ${doctor.lastName}`}
                >
                  To: {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>

          {renderFormField(
            "Description",
            "Describe what you're feeling",
            "text"
          )}

          <button>send</button>
        </div>
        <div className={styles.appointments}>
          <div>Here's your Scheduled appointments</div>
          {user?.appointments?.map((appointment, index) => (
            <div key={index} className={styles.appointment}>
              <span>{appointment.date ?? ""}</span>
              {addDeleteAppointmentMode && (
                <div className={styles.appointmentsButtons}>
                  <button onClick={() => handleDeleteAppointment(index)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {addDeleteAppointmentMode ? (
            <>
              <select
                className={`form-select ${styles.input} ${
                  state.selectedDoctorError ? styles.invalid : ""
                }`}
                id="floatingSelectedDoctor"
                name="selectedDoctor"
                value={state.selectedDoctor}
                onChange={(event) => handleInputChange(event, "selectedDoctor")}
              >
                <option value="">Select an option</option>
                {user &&
                  doctors &&
                  doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={`${doctor.firstName} ${doctor.lastName}`}
                    >
                      With: {doctor.firstName} {doctor.lastName}
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
          <p>If you want To add Doctors, please select Doctor:</p>
          <select
            className={`form-select ${styles.input} ${
              state.userTypeError ? styles.invalid : ""
            }`}
            id="floatingNewDoctor"
            name="newDoctor"
            value={state["newDoctor"]}
            onChange={handleSelectChange}
          >
            <option value="">Select a Doctor</option>
            {user &&
              doctorsList &&
              doctorsList.map((doctor) => (
                <option
                  key={doctor.id}
                  value={`${doctor.firstName} ${doctor.lastName}`}
                >
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>

          <button onClick={handleAddDoctor}>Add Doctor</button>
        </div>
      </div>
    </div>
  );
}
