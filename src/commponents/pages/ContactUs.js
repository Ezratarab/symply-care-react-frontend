import React, { useState } from "react";
import styles from "./ContactUs.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/contactus.jpg";
import APIService from "../service/APIService";
import Swal from "sweetalert2";

const ContactUs = () => {
  const defaultState = {
    text: "",
    email: "",
    textError: "",
    emailError: "",
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
    let textError = "";
    let emailError = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!state.email || !emailRegex.test(state.email)) {
      emailError = "Invalid email address";
    }

    if (!state.text) {
      textError = "Message field is required";
    }

    if (textError || emailError) {
      setState({ ...state, textError, emailError });
      return false;
    }

    return true;
  };

  const submit = () => {
    if (validate()) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to send this message?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, send it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          console.warn(state);
          const response = APIService.contactUs(state.email, state.text);

          if (response) {
            Swal.fire({
              title: "Success!",
              text: "Your message has been sent successfully.",
              icon: "success",
            });
            console.log("Inquiry has been answered successfully: ", response);
            window.location.reload();
          } else {
            Swal.fire({
              title: "Error!",
              text: "There was an error sending your message.",
              icon: "error",
            });
            console.error("Empty response or missing data in the response.");
          }
          setState(defaultState);
        }
      });
    }
  };

  return (
    <div className={styles.app}>
      <div className={`container-fluid ${styles.psMd0}`}>
        <div className="row g-0">
          <div
            className={`d-none d-md-flex col-md-4 col-lg-6 ${styles.bgImage}`}
            style={{ backgroundImage: `url(${backgroundImage})` }}
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
                      Let us know if you have any questions!
                    </h3>

                    <form>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="text"
                          className={`form-control ${styles.input} ${
                            state.emailError ? styles.invalid : ""
                          }`}
                          id="floatingInput"
                          name="email"
                          placeholder="email"
                          value={state.email}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingInput">Your Email</label>
                        <span className={`text-danger ${styles.emailError}`}>
                          {state.emailError}
                        </span>
                      </div>

                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="text"
                          className={`form-control ${styles.input} ${
                            state.textError ? styles.invalid : ""
                          }`}
                          id="floatingText"
                          name="text"
                          placeholder="Your Message"
                          value={state.text}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingPassword">Your Message</label>
                        <span className={`text-danger ${styles.textError}`}>
                          {state.textError}
                        </span>
                      </div>

                      <div className={`d-grid ${styles.grid}`}>
                        <button
                          className={`btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 ${styles.signInButton}`}
                          type="button"
                          onClick={submit}
                        >
                          Send
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

export default ContactUs;
