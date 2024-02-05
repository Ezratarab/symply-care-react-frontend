import React, { useEffect, useState } from "react";
import Doctor from "../../Doctor";
import "./Doctors.css";
import APIService from "../service/APIService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await APIService.getAllDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }

    fetchDoctors();
  }, []);
  return (
    <div className="doctor-section" id="doctors">
      <div className="dt-title-content">
        <h3 className="dt-title">
          <span>Meet Our Doctors</span>
        </h3>

        <p className="dt-description">
          Meet our exceptional team of specialist doctors, dedicated to
          providing top-notch healthcare services at SYMPly-Care. Trust in their
          knowledge and experience to lead you towards a healthier and happier
          life.
        </p>
      </div>
      <div className="dt-cards-content">
        {doctors.map((doctor) => (
          <Doctor
            key={doctor.id}
            img={`data:image/jpeg;base64,${doctor.imageData}`} // Here's the corrected img attribute
            name={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            title={doctor.specialization}
            stars={doctor.rating}
            reviews={doctor.reviews}
            experience={doctor.experience}
          />
        ))}
      </div>
    </div>
  );
}

export default Doctors;
