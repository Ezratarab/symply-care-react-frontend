import React, { useContext, useState } from "react";
import styles from "./LogIn.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link, Navigate, useNavigate } from "react-router-dom";
import backgroundImage from '../assets/op5.jpg';
import authServiceInstance from "../service/APIService";
import { UserContext } from "../Context";


const LogIn = () => {
  const defaultState = {
    email: "",
    password: "",
    passwordError: "",
    emailError: "",
  };

  const [state, setState] = useState(defaultState);
  const navigate = useNavigate();
  const { isLogin, setIsLogin } = useContext(UserContext);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      [`${name}Error`]: "", // Reset the error for the current input field
    }));
  };

  function handleLoginLogout() {
    // Assuming isLogin is a boolean indicating whether the user is logged in or not
    setIsLogin(!isLogin); // Toggle the login state
  }

  const validate = () => {

    let passwordError = "";
    let emailError = "";


    if (state.email === false) {
      emailError = "Email Field is Invalid ";
    }

    if (!state.password) {
      passwordError = "Password field is required";
    }

    if ( passwordError || emailError) {
      setState({ ...state,passwordError, emailError });
      return false;
    }

    return true;
  };

  const submit = (e) => {
    if (validate()) {
      console.warn(state);
      setState(defaultState);
      e.preventDefault();

    authServiceInstance.login(state.email, state.password)
        .then(
            (response) => {

                console.log('Login successful')
                console.log('Response data:', response.data);
                navigate('/home');
                window.location.reload();
                console.log('Login successful');
                handleLoginLogout()
            },
            (error) => {
                console.error('Login error:', error);
                navigate('/signup');
            }
        );
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
                      Welcome back!
                    </h3>

                    <form>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="email"
                          className={`form-control ${styles.input} ${
                            state.emailError ? styles.invalid : ""
                          }`}
                          id="floatingInput"
                          name="email"
                          placeholder="Email Address"
                          value={state.email}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingInput">Email Address</label>
                        <span className={`text-danger ${styles.errorText}`}>
                          {state.emailError}
                        </span>
                      </div>
                      <div
                        className={`form-floating mb-3 ${styles.formFloating}`}
                      >
                        <input
                          type="password"
                          className={`form-control ${styles.input} ${
                            state.passwordError ? styles.invalid : ""
                          }`}
                          id="floatingPassword"
                          name="password"
                          placeholder="Password"
                          value={state.password}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                        <span className={`text-danger ${styles.errorText}`}>
                          {state.passwordError}
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
                          Sign in
                        </button>
                        <div
                          className={`d-flex justify-content-between mb-2 ${styles.forgotRegisterButtons}`}
                        >
                          <Link to="/forgotPassword">
                          <button
                            className={`btn btn-lg btn-primary btn-login fw-bold ${styles.forgotPasswordButton}`}
                            style={{ width: "115%", height: "45px" }}
                            type="button"
                          >
                            Forgot password?
                          </button>
                          </Link>
                          <div style={{ width: "48%" }}>
                            <Link to="/signup">
                              <button
                                className={`btn btn-lg btn-primary btn-login fw-bold w-100 ${styles.notRegisteredButton}`}
                                style={{ height: "45px" }}
                                type="button"
                              >
                                Not registered yet?
                              </button>
                            </Link>
                          </div>
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

export default LogIn;
