import "./App.module.css";
import APIService from "./commponents/service/APIService";
import DeletePatient from "./commponents/DeletePatient";
import DoctorsList from "./commponents/DoctorsList";
import Home from "./commponents/pages/Home";
import LogIn from "./commponents/pages/LogIn";
import PatientList from "./commponents/PatientsList";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import SignUp from "./commponents/pages/SignUp";
import About from "./commponents/pages/About";
import NavBar from "./commponents/NavBar";
import backVid from "./commponents/assets/video.mp4";
import BubbleHome from "./commponents/BubbleHome";
import image from "./commponents/assets/back.jpeg";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/doctors/doctors" element={<DoctorsList />} />
          <Route path="/patients/patients" element={<PatientList />} />
          <Route
            path="/patients/deletePatient/:id"
            element={<DeletePatient />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
