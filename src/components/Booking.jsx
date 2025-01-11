import React, { useState, useEffect } from "react";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import Button from "@mui/material/Button";
import "../style/booking.css";
import "../style/trip.css";
import Modal from "react-bootstrap/Modal";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import api from "../api";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import SingleSeats from "./SingleSeats";

const Booking = ({ confirmationNum, userId, reservation }) => {
  const [showModal, setShowModal] = useState(false);
  const [deptFlight, setDeptFlight] = useState("");
  const [arrFlight, setArrFlight] = useState("");
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleModalShow = () => setShowModal(!showModal);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      const { DepFlight, ArrFlight } = reservation;
      const deptResponse = await api.getFlightById(DepFlight._id);
      const arrResponse = await api.getFlightById(ArrFlight._id);

      setDeptFlight(deptResponse.data.data);
      setArrFlight(arrResponse.data.data);
    };
    fetchFlightDetails();
  }, [reservation]);

  const handleSeatsChange = (att, seats) => {
    sessionStorage.setItem(att, JSON.stringify(seats));
    // Not needed to setState as we're already using sessionStorage
  };

  const editDeparture = (oldFlight) => {
    sessionStorage.setItem("oldCabin", reservation.DepCabin);
    sessionStorage.setItem("oldSeat", reservation.DepSeat);
    sessionStorage.setItem("oldFlight", JSON.stringify(oldFlight));
    sessionStorage.setItem("editReservation", JSON.stringify(reservation));
    sessionStorage.setItem("depFlight", JSON.stringify(deptFlight));
    sessionStorage.setItem("retFlight", JSON.stringify(arrFlight));
    navigate("/editDep");
  };

  const editReturn = (oldFlight) => {
    sessionStorage.setItem("oldCabin", reservation.ArrCabin);
    sessionStorage.setItem("oldSeat", reservation.ArrSeat);
    sessionStorage.setItem("oldFlight", JSON.stringify(oldFlight));
    sessionStorage.setItem("editReservation", JSON.stringify(reservation));
    sessionStorage.setItem("depFlight", JSON.stringify(deptFlight));
    sessionStorage.setItem("retFlight", JSON.stringify(arrFlight));
    navigate("/editRet");
  };

  const {
    PassengerFirstName,
    PassengerLastName,
    PassengerType,
    DepFlight,
    ArrFlight,
    DepCabin,
    ArrCabin,
    DepSeat,
    ArrSeat,
  } = reservation;

  const dep = DepCabin === "Economy" ? "EconomySeats" : DepCabin === "Business" ? "BusinessSeats" : DepCabin === "FirstClass" ? "FirstClassSeats" : "";
  const arr = DepCabin === "Economy" ? "EconomySeats" : DepCabin === "Business" ? "BusinessSeats" : DepCabin === "FirstClass" ? "FirstClassSeats" : "";
  const depType = PassengerType === "Adult" ? "PriceAdult" : "PriceChild";
  const arrType = PassengerType === "Adult" ? "PriceAdult" : "PriceChild";

  const totalPrice = deptFlight && arrFlight ? deptFlight[dep][depType] + arrFlight[arr][arrType] : 0;

  return (
    <>
      <div className="booking-card">
        <div style={{ width: "70%", marginTop: "5px" }}>
          <div
            style={{
              marginLeft: "2rem",
              marginBottom: "7px",
              marginTop: "0px",
            }}
          >
            <strong>
              <h5 className="emphasis">
                {PassengerFirstName.toUpperCase() +
                  " " +
                  PassengerLastName.toUpperCase()}
              </h5>
            </strong>
          </div>

          <div className="booking-flight" style={{ marginTop: "0px" }}>
            <div className="trip-flex-col">
              <p className="emphasis">
                {deptFlight.DepartureDate}
                {">"} {deptFlight.ArrivalDate}{" "}
              </p>
              <p>
                {deptFlight.DepartureTime} {">"} {deptFlight.ArrivalTime}
              </p>
            </div>

            <div className="trip-flex-col">
              <div className="flex-row">
                <div className="emphasis">
                  <AirlineSeatReclineNormalIcon />
                  {DepSeat}
                </div>
                <EditIcon
                  className={
                    new Date() < new Date(deptFlight.DepartureDate)
                      ? "icon"
                      : "icon-disabled"
                  }
                  onClick={
                    new Date() < new Date(deptFlight.DepartureDate)
                      ? handleModalShow
                      : ""
                  }
                />
              </div>
              <p style={{ width: "120px", textAlign: "center" }}>
                {reservation.DepCabin}
              </p>
            </div>

            <div className="trip-flex-col">
              <p className="emphasis">{deptFlight.TripDuration} </p>
              <p>
                {deptFlight.DepartureAirport}-{deptFlight.ArrivalAirport}
              </p>
            </div>

            <EditIcon
              className={
                new Date() < new Date(deptFlight.DepartureDate)
                  ? "icon"
                  : "icon-disabled"
              }
              onClick={
                new Date() < new Date(deptFlight.DepartureDate)
                  ? () => editDeparture(deptFlight)
                  : ""
              }
            />
          </div>

          <div className="booking-flight">
            <div className="trip-flex-col">
              <p className="emphasis">
                {arrFlight.DepartureDate}
                {">"} {arrFlight.ArrivalDate}{" "}
              </p>
              <p>
                {arrFlight.DepartureTime} {">"} {arrFlight.ArrivalTime}
              </p>
            </div>

            <div className="trip-flex-col">
              <div className="flex-row">
                <div className="emphasis">
                  <AirlineSeatReclineNormalIcon />
                  {ArrSeat}
                </div>
                <EditIcon
                  className={
                    new Date() < new Date(arrFlight.DepartureDate)
                      ? "icon"
                      : "icon-disabled"
                  }
                  onClick={
                    new Date() < new Date(arrFlight.DepartureDate)
                      ? handleModalShow
                      : ""
                  }
                />
              </div>

              <p style={{ width: "120px", textAlign: "center" }}>
                {reservation.ArrCabin}
              </p>
            </div>

            <div className="trip-flex-col">
              <p className="emphasis">{arrFlight.TripDuration} </p>
              <p>
                {arrFlight.DepartureAirport}-{arrFlight.ArrivalAirport}
              </p>
            </div>

            <EditIcon
              className={
                new Date() < new Date(arrFlight.DepartureDate)
                  ? "icon"
                  : "icon-disabled"
              }
              onClick={
                new Date() < new Date(arrFlight.DepartureDate)
                  ? () => editReturn(arrFlight)
                  : ""
              }
            />
          </div>
        </div>
        <div className="vl"></div>
        <div className="trip-flex-col" style={{ width: "30%" }}>
          <h3>{totalPrice}$</h3>
        </div>
      </div>
      <Modal
        centered
        show={showModal}
        onHide={handleModalShow}
        dialogClassName="my-modal2"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "600" }}>
            Edit your Seats
          </Modal.Title>
        </Modal.Header>
        <SingleSeats
          preChosen={[]}
          parentFunc={(att, seats) => handleSeatsChange(att, seats)}
          seats={[]}
          att="editSeats"
          type={""}
          seatClass={""}
          passengers={1}
        />
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalShow}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Booking;