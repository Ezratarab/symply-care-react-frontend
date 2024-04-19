import "./App.module.css";
import Doctors from "./commponents/pages/Doctors";
import Home from "./commponents/pages/Home";
import LogIn from "./commponents/pages/LogIn";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./commponents/pages/SignUp";
import About from "./commponents/pages/About";
import NavBar from "./commponents/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./commponents/pages/ContactUs";
import { UserProvider } from "./commponents/Context";
import ForgotPassword from "./commponents/pages/ForgotPassword";
import DoctorProfile from "./commponents/pages/DoctorProfile";
import PatientProfile from "./commponents/pages/PatientProfile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <NavBar />
          <Routes>
            <Route path="/ourDoctors" element={<Doctors />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path={`/patients/patient/:id`} element={<PatientProfile />} />
            <Route path={`/doctors/doctor/:id`} element={<DoctorProfile />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
