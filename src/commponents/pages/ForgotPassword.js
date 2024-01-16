import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/contactus.jpg";

const ForgotPassword = () => {
  const defaultState = {
    text: "",
    id: "",
    textError: "",
    IdError: "",
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
    let IdError = "";

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!state.id || reg.test(state.id) === false) {
      IdError = "ID Field is Invalid ";
    }
    if (!state.text) {
      textError = "Message field is required";
    }

    if (textError || IdError) {
      setState({ ...state, textError, IdError });
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
                      Reset Password
                    </h3>

                    <form>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="id"
                          className={`form-control ${styles.input} ${
                            state.IdError ? styles.invalid : ""
                          }`}
                          id="floatingInput"
                          name="id"
                          placeholder="id number"
                          value={state.id}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingInput">ID Number</label>
                        <span className={`text-danger ${styles.IdError}`}>
                          {state.IdError}
                        </span>
                      </div>

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
                          className={`btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 ${styles.signInButton}`}
                          type="button"
                          onClick={submit}
                        >
                          reset password
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
