import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import "../style/booking.css";
import "../style/trip.css";
import Modal from "react-bootstrap/Modal";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import api from "../api";
import TripDetailsModal from "./TripDetailsModal";

const SingleFlight = ({ flight, parentFunc }) => {
  const [showModal, setShowModal] = useState(false);
  const [deptCabin, setDeptCabin] = useState("");
  const [searchFlight, setSearchFlight] = useState("");
  const location = useLocation();

  const handleModalShow = () => setShowModal(!showModal);

  useEffect(() => {
    if (location.pathname === "/editDep") {
      setSearchFlight(JSON.parse(sessionStorage.getItem("depFlight")));
      setDeptCabin(sessionStorage.getItem("cabinSearch"));
    } else {
      setSearchFlight(JSON.parse(sessionStorage.getItem("retFlight")));
      setDeptCabin(sessionStorage.getItem("cabinSearch"));
    }
  }, [location.pathname]);

  return (
    <>
      <div className="single-card">
        <div style={{ width: "70%", marginTop: "5px" }}>
          <div className="booking-flight">
            <p className="emphasis"> {flight.FlightNumber}</p>
            <div className="trip-flex-col">
              <p className="emphasis">
                {flight.DepartureDate}
                {">"} {flight.ArrivalDate}{" "}
              </p>
              <p>
                {flight.DepartureTime} {">"} {flight.ArrivalTime}
              </p>
            </div>

            <div className="trip-flex-col">
              <p className="emphasis">{flight.TripDuration} </p>
              <p>
                {flight.DepartureAirport}-{flight.ArrivalAirport}
              </p>
            </div>

            <a href="#" onClick={handleModalShow}>
              Details {">"}
            </a>
          </div>
        </div>
        <div className="vl"></div>
        <div className="trip-flex-col" style={{ width: "30%" }}>
          <h3>{flight[sessionStorage.getItem("cabinSearch")].PriceAdult}$</h3>
          <Button
            style={{
              backgroundColor: "#37A1E2",
              width: "5 em",
              height: "5vh",
              fontSize: "small",
            }}
            onClick={() => parentFunc(flight)}
            variant="contained"
          >
            Reserve
          </Button>
        </div>
      </div>

      <TripDetailsModal
        show={showModal}
        parentFunc={handleModalShow}
        fNum={flight.FlightNumber}
        depDate={flight.DepartureDate}
        arrDate={flight.ArrivalDate}
        depTime={flight.DepartureTime}
        arrTime={flight.ArrivalTime}
        duration={flight.TripDuration}
        depAirport={flight.DepartureAirport}
        arrAirport={flight.ArrivalAirport}
        cabinClass={deptCabin}
        baggage={flight[sessionStorage.getItem("cabinSearch")].BaggageAllowance}
      />
    </>
  );
};

export default SingleFlight;