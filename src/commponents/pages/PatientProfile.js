import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./PatientProfile.module.css";
import { UserContext } from "../Context";
import authServiceInstance from "../service/APIService";
import authServicehelpers from "../service/AuthServiceHelpers";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import APIService from "../service/APIService";
import defaultImage from "../assets/user.png";
import AuthWrapper from "../service/AuthWrapper";
import Swal from "sweetalert2";

export default function PatientProfile() {
  const { isLogin } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addDeleteAppointmentMode, setAddDeleteAppointmentMode] =
    useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [userType, setUserType] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const Swal = require("sweetalert2");
  const [answeredOpen, setAnsweredOpen] = useState(false);
  const [unansweredOpen, setUnansweredOpen] = useState(false);

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
    selectedDoctorForMessage: "",
    selectedDoctorForAppointment: "",
    newAppointmentDate: "",
    newAppointmentTime: "",
    description: "",
    descriptionError: "",
    newAppointmentTimeError: "",
    newAppointmentDateError: "",
    idError: "",
    firstNameError: "",
    selectedDoctorForMessageError: "",
    selectedDoctorForAppointmentError: "",
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
      firstName: state.firstName || user.firstName,
      lastName: state.lastName || user.lastName,
      email: user.email,
      password: user.password,
      city: state.city || user.city,
      country: state.country || user.country,
      street: state.street || user.street,
      birthDay: state.birthDay || user.birthDay,
      imageData: state.imageData || user.imageData,
      inquiriesList: user.inquiriesList,
      doctors: user.doctors,
      appointments: user.appointments,
    };

    return newUser; // Ensure you return the newUser object
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

  const handleAddDoctor = async () => {
    if (state.newDoctor !== "") {
      const selectedDoctor = doctorsList.find(
        (doctor) => `${doctor.firstName} ${doctor.lastName}` === state.newDoctor
      );
      const isDoctorAlreadyAdded = user.doctors.some(
        (doctor) => doctor.email === selectedDoctor.email
      );

      if (!isDoctorAlreadyAdded) {
        try {
          const response = await APIService.addDoctorToPatient(
            user.id,
            selectedDoctor
          );
          setState((prevState) => ({
            ...prevState,
            newDoctor: "",
          }));
          window.location.reload();
          Swal.fire({
            title: "Success",
            text: "The doctor has been successfully added.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error adding doctor to patient:", error);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "The selected doctor is already added!",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.log("Doctor is already added to the patient's list.");
      }
    }
  };

  const updatePatient = async () => {
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

  const fileInputRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await APIService.uploadImageForPatient(user, formData);
        console.log("Image uploaded successfully:", response);
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  useEffect(() => {
    async function getUser() {
      if (isLogin) {
        try {
          const userStorage = authServicehelpers.getCurrentUser();
          let response;
          if (
            userStorage &&
            userStorage.roles &&
            userStorage.roles[0] === "ROLE_PATIENT"
          ) {
            response = await authServiceInstance.getPatientByEmail(
              userStorage.sub
            );
            setUserType("Patient");
          } else if (
            userStorage &&
            userStorage.roles &&
            userStorage.roles[0] === "ROLE_DOCTOR"
          ) {
            response = await authServiceInstance.getDoctorByEmail(
              userStorage.sub
            );
            setUserType("Doctor");
          }
          if (
            response &&
            userStorage &&
            userStorage.roles &&
            userStorage.roles[0] === "ROLE_PATIENT"
          ) {
            const user = response.data;
            setUser(user);
            const updatedState = Object.keys(user).reduce((acc, key) => {
              if (user[key]) {
                acc[key] = user[key];
              }
              return acc;
            }, {});

            setState(updatedState);
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
        const response = await APIService.getAllDoctorsWithInquiries();
        setDoctorsList(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }

    fetchDoctors();
    getUser();
  }, [isLogin]);

  useEffect(() => {
    console.log("State updated:", state);
  }, [state]);

  const handleDeleteAppointment = async (appointmentID) => {
    try {
      const response = await APIService.deleteDoctorAppointment(appointmentID);
      console.log("Patient appointment deleted successfully:", response);
      window.location.reload();
      Swal.fire({
        title: "Success",
        text: "The appointment has been successfully deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting patient appointment:", error);
    }
  };
  const handleAddInquiry = async () => {
    const selectedDoctor = state.selectedDoctorForMessage;
    const description = state.description;
    if (selectedDoctor && description) {
      const foundDoctor = doctorsList.find(
        (doctor) =>
          `${doctor.firstName} ${doctor.lastName}` ===
          state.selectedDoctorForMessage
      );
      try {
        const response = await APIService.addInquiryToPatient(
          user,
          foundDoctor, // Use the foundDoctor variable here
          description
        );
        console.log("Inquiry added successfully:", response);
        window.location.reload();
        Swal.fire({
          title: "Success",
          text: "The inquiry has been successfully sent.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error adding inquiry:", error);
      }
    } else {
      console.error("Please select a doctor and provide a description.");
    }
  };

  const handleAddDeleteAppointment = async (event) => {
    if (state.selectedDoctorForAppointment !== "") {
      const selectedDoctor = doctorsList.find(
        (doctor) =>
          `${doctor.firstName} ${doctor.lastName}` ===
          state.selectedDoctorForAppointment
      );
      const date = state.newAppointmentDate + " " + state.newAppointmentTime;
      try {
        const response = await APIService.addAppointmentToPatient(
          user,
          selectedDoctor,
          date
        );
        console.log("Patient appointment added successfully:", response);
        window.location.reload();
        Swal.fire({
          title: "Success",
          text: "The appointment has been successfully added.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error adding patient appointment:", error);
      }
    }
    setUser((prevUser) => ({
      ...prevUser,
      newAppointmentDate: "",
      newAppointmentTime: "",
    }));
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
        onChange={(event) => handleInputChange(event, fieldName)}
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
                  <img
                    src={`data:image/jpeg;base64,${user.imageData}`}
                    alt="User"
                    className={styles.profileImage}
                  />
                ) : (
                  <img
                    src={defaultImage}
                    alt="Default User"
                    className={styles.profileImage}
                  />
                )}
              </div>
              <div className={styles.name}>
                {user?.firstName ?? ""} {user?.lastName ?? ""}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
              ref={fileInputRef}
            />

            <button
              className={styles.changeImageButton}
              onClick={() => {
                // Display SweetAlert2 confirmation dialog
                Swal.fire({
                  title: "Change Image",
                  text: "Are you sure you want to change the image profile?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                  cancelButtonText: "No",
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Click the hidden input element when confirmed
                    fileInputRef.current.click();
                  }
                });
              }}
              style={{
                width: "150px",
                marginLeft: "20px",
                marginTop: "-30px",
                marginBottom: "20px",
              }}
            >
              Change Image
            </button>
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
              className={styles.saveEditButton}
              onClick={() => {
                if (editMode) {
                  Swal.fire({
                    title: "Do you want to save the changes?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Saved!", "", "success");
                      updatePatient();
                    } else if (result.isDenied) {
                      Swal.fire("Changes are not saved", "", "info");
                    }
                  });
                } else {
                  // Toggle edit mode
                  setEditMode((prevEditMode) => !prevEditMode);
                }
              }}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.miniNavbar}>
            <div className={styles.buttonContainer}>
              <button onClick={() => setSelectedTab("messageToDoctor")}>
                Message to doctor
              </button>
              <button onClick={() => setSelectedTab("inquiries")}>
                Inquiries
              </button>
              <button onClick={() => setSelectedTab("scheduleAppointment")}>
                Schedule Appointment
              </button>
              <button onClick={() => setSelectedTab("addDoctor")}>
                Add Doctor
              </button>
            </div>
          </div>
          {selectedTab === "messageToDoctor" && (
            <div className={styles.messageToDoctor}>
              <p>
                You may submit a detailed description of your symptoms to the
                healthcare provider of your preference. Kindly select a doctor
                and articulate your symptoms:
              </p>
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
                <option value="">Select a Doctor</option>
                {user &&
                  user.doctors &&
                  user.doctors.map((doctor) => (
                    <option
                      key={doctor.email}
                      value={`${doctor.firstName} ${doctor.lastName}`}
                    >
                      {`${doctor.firstName} ${doctor.lastName}`}
                    </option>
                  ))}
              </select>

              {renderFormField(
                "description",
                "Describe what you're feeling",
                "text",
                styles.input // Add your custom style for the description input
              )}

              <button
                className={styles.sendButton} // Add your custom style for the send button
                type="button"
                onClick={() => {
                  console.log(state.selectedDoctorForMessage);
                  console.log(state.description);
                  if (!state.selectedDoctorForMessage || !state.description) {
                    // If any of the required fields is missing, display an error message
                    Swal.fire({
                      title: "Error",
                      text: "Please select a doctor and provide a description.",
                      icon: "error",
                      confirmButtonText: "OK",
                    });
                  } else {
                    Swal.fire({
                      title: "Send Inquiry",
                      text: "Are you sure you want to send this inquiry?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Send",
                      cancelButtonText: "Cancel",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleAddInquiry();
                      }
                    });
                  }
                }}
              >
                Send
              </button>
            </div>
          )}

          {selectedTab === "inquiries" && (
            <div className={styles.inquiries}>
              <div className={styles.answeredInquiries}>
                <div
                  className={styles.subTitle}
                  onClick={() => setAnsweredOpen(!answeredOpen)}
                >
                  {answeredOpen ? (
                    <span className={styles.openIndicator}>&#10533; </span>
                  ) : (
                    <span className={styles.openIndicator}>&#10532; </span>
                  )}
                  Answered Inquiries
                </div>
                {answeredOpen &&
                  user?.inquiriesList?.map((inquiry, index) => {
                    const doctor = inquiry.hasAnswered
                      ? doctorsList.find((doc) =>
                          doc.inquiriesList.some(
                            (doctorInquiry) => doctorInquiry.id === inquiry.id
                          )
                        )
                      : null;
                    return (
                      inquiry.hasAnswered && (
                        <div key={index} className={styles.inquiry}>
                          <div
                            className={styles.inquiryId}
                          >{`Inquiry ID: ${inquiry.id}`}</div>
                          <div>
                            {doctor &&
                              `-   with Dr. ${doctor.firstName} ${doctor.lastName}`}
                          </div>
                          {inquiry.hasAnswered && (
                            <>
                              <div className={styles.message}>
                                Message: {inquiry.symptoms}
                              </div>
                              <div className={styles.answer}>
                                Answer: {inquiry.answer}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    );
                  })}
                {answeredOpen &&
                  user?.inquiriesList?.every(
                    (inquiry) => !inquiry.hasAnswered
                  ) && (
                    <div className={styles.noAnswered}>
                      No answered inquiries yet
                    </div>
                  )}
              </div>
              <div className={styles.unansweredInquiries}>
                <div
                  className={styles.subTitle}
                  onClick={() => setUnansweredOpen(!unansweredOpen)}
                >
                  {unansweredOpen ? (
                    <span className={styles.openIndicator}>&#10533; </span>
                  ) : (
                    <span className={styles.openIndicator}>&#10532; </span>
                  )}
                  Here are your Unanswered Inquiries
                </div>
                {unansweredOpen &&
                  user?.inquiriesList?.map((inquiry, index) => {
                    const doctor = !inquiry.hasAnswered
                      ? doctorsList.find((doc) =>
                          doc.inquiriesList.some(
                            (doctorInquiry) => doctorInquiry.id === inquiry.id
                          )
                        )
                      : null;
                    return (
                      !inquiry.hasAnswered && (
                        <div key={index} className={styles.inquiry}>
                          <div
                            className={styles.inquiryId}
                          >{`Inquiry ID: ${inquiry.id}`}</div>
                          <div>
                            {doctor &&
                              `-   with Dr. ${doctor.firstName} ${doctor.lastName}`}
                          </div>
                          <div className={styles.message}>
                            Message: {inquiry.symptoms}
                          </div>
                        </div>
                      )
                    );
                  })}
                {unansweredOpen &&
                  user?.inquiriesList?.every(
                    (inquiry) => inquiry.hasAnswered
                  ) && (
                    <div className={styles.noUnanswered}>
                      No unanswered inquiries
                    </div>
                  )}
              </div>
            </div>
          )}

          {selectedTab === "scheduleAppointment" && (
            <div className={styles.appointments}>
              <div className={styles.sectionTitle}>Scheduled Appointments</div>
              {user?.appointments?.map((appointment, index) => {
                const doctor = doctorsList.find((doc) => {
                  const doctorAppointments = doc.appointments || [];
                  return doctorAppointments.some(
                    (doctorAppointment) =>
                      doctorAppointment.id === appointment.id
                  );
                });
                return (
                  <div key={index} className={styles.appointment}>
                    <span>{appointment.date ?? ""}</span>
                    <span className={styles.doctorName}>
                      {doctor
                        ? `-   with Dr. ${doctor.firstName} ${doctor.lastName}`
                        : " --none"}
                    </span>
                    {addDeleteAppointmentMode && (
                      <div className={styles.appointmentsButtons}>
                        <button
                          onClick={() => {
                            // Display SweetAlert2 confirmation dialog
                            Swal.fire({
                              title: "Delete Appointment",
                              text: "Are you sure you want to delete this appointment?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Delete",
                              cancelButtonText: "Cancel",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleDeleteAppointment(appointment.id);
                              }
                            });
                          }}
                          className={styles.deleteAppointmentButton}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {addDeleteAppointmentMode ? (
                <div className={`form-floating mb-3 ${styles.formFloating}`}>
                  <select
                    className={`form-select ${styles.input} ${
                      state.selectedDoctorForAppointmentError
                        ? styles.invalid
                        : ""
                    }`}
                    id="selectedDoctorForAppointment"
                    name="selectedDoctorForAppointment"
                    value={state.selectedDoctorForAppointment}
                    onChange={(event) =>
                      handleInputChange(event, "selectedDoctorForAppointment")
                    }
                  >
                    <option value="">Select a Doctor</option>
                    {user &&
                      user.doctors &&
                      user.doctors.map((doctor) => (
                        <option
                          key={doctor.email}
                          value={`${doctor.firstName} ${doctor.lastName}`}
                        >
                          {`${doctor.firstName} ${doctor.lastName}`}
                        </option>
                      ))}
                  </select>
                  <form className={styles.newAppointmentForm}>
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
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          // Check if date and time are set
                          if (
                            !state.newAppointmentDate ||
                            !state.newAppointmentTime ||
                            !state.selectedDoctorForAppointment
                          ) {
                            // If date or time is not set, show an error alert
                            Swal.fire({
                              title: "Error",
                              text: "Please select both date and time for the appointment, and Provide a doctor",
                              icon: "error",
                              confirmButtonText: "OK",
                            });
                          } else {
                            // If both date and time are set, display SweetAlert2 confirmation dialog
                            Swal.fire({
                              title: "Add Appointment",
                              text: "Are you sure you want to add this appointment?",
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonText: "Add",
                              cancelButtonText: "Cancel",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleAddDeleteAppointment();
                              }
                            });
                          }
                        }}
                        className={styles.addAppointmentButton}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddDeleteAppointmentMode(false)}
                        className={styles.doneAppointmentButton}
                      >
                        Done
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setAddDeleteAppointmentMode(true)}
                  className={styles.addDeleteAppointmentButton}
                >
                  Add / Delete Appointment
                </button>
              )}
            </div>
          )}
          {selectedTab === "addDoctor" && (
            <div className={styles.addDoctors}>
              <p>If you want to add a doctor, please select from the list:</p>
              <select
                className={`form-select ${styles.input} ${
                  state.userTypeError ? styles.invalid : ""
                }`}
                id="floatingNewDoctor"
                name="newDoctor"
                value={state["newDoctor"]}
                onChange={(event) => handleInputChange(event, "newDoctor")}
                style={{
                  border: state.userTypeError
                    ? "1px solid red"
                    : "1px solid #ccc",
                }}
              >
                <option value="">Select a Doctor</option>
                {user &&
                  doctorsList &&
                  doctorsList.map((doctor) => (
                    <option
                      key={doctor.email}
                      value={`${doctor.firstName} ${doctor.lastName}`}
                    >
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
              </select>
              <button
                className={styles.addDoctorButton}
                onClick={() => {
                  if (!state.newDoctor) {
                    // Display SweetAlert2 error message if newDoctor is empty
                    Swal.fire({
                      title: "Error",
                      text: "Please provide details for the new doctor.",
                      icon: "error",
                      confirmButtonText: "OK",
                    });
                  } else {
                    // Display SweetAlert2 confirmation dialog for adding the doctor
                    Swal.fire({
                      title: "Add Doctor",
                      text: "Are you sure you want to add this doctor?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Add",
                      cancelButtonText: "Cancel",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleAddDoctor();
                      }
                    });
                  }
                }}
              >
                Add Doctor
              </button>
            </div>
          )}
        </div>
      </AuthWrapper>
    </div>
  );
}
