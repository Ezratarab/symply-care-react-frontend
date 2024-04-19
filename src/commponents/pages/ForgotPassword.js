import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link, Navigate, useNavigate } from "react-router-dom";
import APIService from "../service/APIService";
import backgroundImage from "../assets/contactus.jpg";
import Swal from "sweetalert2";
const ForgotPassword = () => {
  const defaultState = {
    email: "",
    newPassword: "",
    id: "",
    emailError: "",
    newPasswordError: "",
    idError: "",
  };

  const [state, setState] = useState(defaultState);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const validate = () => {
    let emailError = "";
    let newPasswordError = "";
    let idError = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.email || !emailRegex.test(state.email)) {
      emailError = "Please enter a valid email address";
    }

    if (!state.newPassword) {
      newPasswordError = "Please enter a new password";
    }

    const idRegex = /^\d+$/; // Only allow digits for the ID number
    if (!state.id || !idRegex.test(state.id)) {
      idError = "Please enter a valid ID number";
    }

    if (emailError || newPasswordError || idError) {
      setState({ ...state, emailError, newPasswordError, idError });
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (validate()) {
      const confirmed = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "Do you want to change your password?",
        showCancelButton: true,
        confirmButtonText: "Yes, chnage it!",
        cancelButtonText: "No, cancel",
      });

      if (confirmed.isConfirmed) {
        try {
          const success = await APIService.changePassword(
            state.email,
            state.id,
            state.newPassword
          );
          if (success) {
            Swal.fire({
              icon: "success",
              title: "Password changed",
              text: "Your password has been successfully changed! going to Log-In....",
            });
            setState(defaultState);
            navigate("/login");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Something went wrong. Please try again later.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response?.data ||
              "Something went wrong. Please try again later.",
          });
        }
      }
    }
  };

  return (
    <div className={styles.app}>
      <div className={`container-fluid ${styles.psMd0}`}>
        <div className="row g-0">
          <div
            className={`d-none d-md-flex col-md-6 col-lg-6 ${styles.bgImage}`}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="col-md-6 col-lg-6">
            <div
              className={`login d-flex align-items-center py-5 ${styles.container}`}
            >
              <div className="container">
                <div className="row">
                  <div
                    className={`col-md-9 col-lg-8 mx-auto ${styles.loginForm}`}
                  >
                    <h3 className={`login-heading mb-4 ${styles.loginHeading}`}>
                      Change Password
                    </h3>

                    <form>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="text"
                          className={`form-control ${styles.input} ${
                            state.idError ? styles.invalid : ""
                          }`}
                          id="id"
                          name="id"
                          placeholder="ID Number"
                          value={state.id}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="id">ID Number</label>
                        <span className={`text-danger ${styles.error}`}>
                          {state.idError}
                        </span>
                      </div>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="email"
                          className={`form-control ${styles.input} ${
                            state.emailError ? styles.invalid : ""
                          }`}
                          id="email"
                          name="email"
                          placeholder="Email Address"
                          value={state.email}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="email">Email Address</label>
                        <span className={`text-danger ${styles.error}`}>
                          {state.emailError}
                        </span>
                      </div>

                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="password"
                          className={`form-control ${styles.input} ${
                            state.newPasswordError ? styles.invalid : ""
                          }`}
                          id="newPassword"
                          name="newPassword"
                          placeholder="New Password"
                          value={state.newPassword}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="newPassword">New Password</label>
                        <span className={`text-danger ${styles.error}`}>
                          {state.newPasswordError}
                        </span>
                      </div>

                      <div className={`d-grid ${styles.grid}`}>
                        <button
                          className={`btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 ${styles.signInButton}`}
                          type="button"
                          onClick={submit}
                        >
                          Reset Password
                        </button>
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

export default ForgotPassword;
