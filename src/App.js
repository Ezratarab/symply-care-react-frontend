import "./App.module.css";
import APIService from "./commponents/service/APIService";
import DeletePatient from "./commponents/DeletePatient";
import Doctors from "./commponents/pages/Doctors";
import Home from "./commponents/pages/Home";
import LogIn from "./commponents/pages/LogIn";
import PatientList from "./commponents/PatientsList";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import SignUp from "./commponents/pages/SignUp";
import About from "./commponents/pages/About";
import NavBar from "./commponents/NavBar";
import backVid from "./commponents/assets/video.mp4";
import BubbleHome from "./commponents/BubbleHome";
import image from "./commponents/assets/back.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./commponents/pages/ContactUs";
import Personal from "./commponents/pages/Personal";
import { UserProvider } from "./commponents/Context";
import ForgotPassword from "./commponents/pages/ForgotPassword";

function App() {

  
  return (
    <div>
      <BrowserRouter>
      <UserProvider>
        <NavBar />
        <Routes>
          <Route path="/doctors/doctors" element={<Doctors />} />
          <Route path="/patients/patients" element={<PatientList />} />
          <Route
            path="/patients/deletePatient/:id"
            element={<DeletePatient />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactus" element={<ContactUs/>} />
          <Route path="/forgotPassword" element={<ForgotPassword/>} />
          <Route path="/" element={<ForgotPassword/>} />
          <Route exact path="/" element={<Navigate to="/home" />} />
        </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
