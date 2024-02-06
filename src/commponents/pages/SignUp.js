import React, { useState } from "react";
import styles from "./SignUp.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Doctor from "../../Doctor";

const SignUp = () => {
  const defaultState = {
    name: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    city: null,
    country: null,
    street: null,
    birthDay: null,
    userType: null, // Added field for Doctor or Patient selection
    IdError: null,
    passwordError: null,
    firstNameError: null,
    lastNameError: null,
    emailError: null,
    cityError: null,
    countryError: null,
    streetError: null,
    birthDayError: null,
    userTypeError: null,
    specialization: "",
    hospital: "",
    HMO: "",
    experience: "",
  };

  const [state, setState] = useState(defaultState);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setState({
      ...state,
      [name]: value,
    });
  };

  const validate = () => {
    let errors = {};
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const fields = [
      "id",
      "password",
      "firstName",
      "lastName",
      "email",
      "city",
      "country",
      "street",
      "birthDay",
      "userType",
      "specialization",
      "hospital",
      "HMO",
      "experience",
    ];

    fields.forEach((field) => {
      if (
        !state[field] ||
        (field === "id" && reg.test(state[field]) === false)
      ) {
        errors[`${field}Error`] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } field is invalid or required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setState({ ...state, ...errors });
      return false;
    }

    return true;
  };

  const submit = () => {
    if (validate()) {
      console.warn(state);
      setState(defaultState);
    }
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
        value={state[fieldName]}
        onChange={handleInputChange}
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
    <div className={styles.app}>
      <div className={`container-fluid ${styles.psMd0}`}>
        <div className="row g-0">
          <div
            className={`d-none d-md-flex col-md-4 col-lg-6 ${styles.bgImage}`}
          ></div>
          <div className="col-md-8 col-lg-6">
            <div
              className={`login d-flex align-items-center py-5 ${styles.container}`}
            >
              <div className="container">
                <div className="row">
                  <div
                    className={`col-md-9 col-lg-8 mx-auto ${styles.loginForm}`}
                  >
                    <h3 className={`login-heading mb-4 ${styles.loginHeading}`}>
                      Hi nice to meet you!
                    </h3>

                    <form>
                      {renderFormField("id", "ID number")}
                      {renderFormField("firstName", "First Name")}
                      {renderFormField("lastName", "Last Name")}
                      {renderFormField("email", "name@example.com")}
                      {renderFormField("city", "City")}
                      {renderFormField("country", "Country")}
                      {renderFormField("street", "Street")}
                      {renderFormField("birthDay", "Birth Day", "date")}

                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <select
                          className={`form-select ${styles.input} ${
                            state.userTypeError ? styles.invalid : ""
                          }`}
                          id="floatingUserType"
                          name="userType"
                          value={state.userType}
                          onChange={handleInputChange}
                        >
                          <option value="">
                            Select an option
                          </option>
                          <option value="Doctor">Doctor</option>
                          <option value="Patient">Patient</option>
                        </select>
                        <label htmlFor="floatingUserType">
                          Are you a Doctor or a Patient?
                        </label>
                        <span className={`text-danger ${styles.errorText}`}>
                          {state.userTypeError}
                        </span>
                      </div>

                      {state.userType === "Doctor" && [
                        renderFormField("specialization", "Specialization"),
                        renderFormField("hospital", "Hospital"),
                        renderFormField("HMO", "HMO"),
                        renderFormField("experience", "Experience"),
                      ]}

                      {renderFormField("password", "Password")}

                      <div className={`form-check mb-3 ${styles.formCheck}`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="rememberPasswordCheck"
                        />
                        <label
                          className={`form-check-label ${styles.checkboxLabel}`}
                          htmlFor="rememberPasswordCheck"
                        >
                          Remember password
                        </label>
                      </div>

                      <div className={`d-grid ${styles.grid}`}>
                        <button
                          className={`btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 ${styles.signUpButton}`}
                          type="button"
                          onClick={submit}
                        >
                          Sign up
                        </button>
                        <div
                          className={`text-center ${styles.alreadyHaveAccount}`}
                        >
                          <a
                            className={`small ${styles.smallLink}`}
                            href="/login"
                          >
                            Already have an account?
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;