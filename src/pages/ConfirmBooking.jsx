import React, { useState } from "react";
import MyHeader from "../components/MyHeader";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Signin from "../components/Signin";
import api from "../api";

const ConfirmBooking = ({ deptSeats, arrSeats }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleModalShow = () => {
    setShowModal(!showModal);
  };

  const handleSignInModal = () => {
    navigate("/signin"); // Use navigate to go to the SignIn page
  };

  const userId = sessionStorage.getItem("userId");
  const deal = sessionStorage.getItem("deal");
  console.log(deal)
  const {
    deptFlight,
    arrFlight,
    deptCabin,
    arrCabin,
    totalPrice,
    deptPrice,
    retPrice,
  } = JSON.parse(deal || "{}");

  let deptSeatNames = "";
  let arrSeatNames = "";
  
  if (deptSeats && arrSeats) {
    deptSeatNames = deptSeats.map((seat, index) =>
      index === deptSeats.length - 1 ? seat.Seat : seat.Seat + ","
    ).join("");

    arrSeatNames = arrSeats.map((seat, index) =>
      index === arrSeats.length - 1 ? seat.Seat : seat.Seat + ","
    ).join("");
  }

  return (
    <>
      <div className="flex-col slide-left">
        <div
          className="booking-card"
          style={{ marginTop: "50px", marginBottom: "30px" }}
        >
          <div style={{ width: "70%", marginTop: "5px" }}>
            <div className="booking-flight">
              <div className="trip-flex-col">
                <p className="emphasis">
                  {deptFlight?.DepartureDate} {" > "} {deptFlight?.ArrivalDate}
                </p>
                <p>
                  {deptFlight?.DepartureTime} {">"} {deptFlight?.ArrivalTime}
                </p>
              </div>

              <div className="trip-flex-col">
                <div className="emphasis">
                  <AirlineSeatReclineNormalIcon />
                  {deptSeatNames}
                </div>
                <p style={{ width: "12", textAlign: "center" }}>
                  {deptCabin === "FirstClassSeats"
                    ? "FirstClass"
                    : deptCabin === "EconomySeats"
                    ? "Economy"
                    : deptCabin === "BusinessSeats"
                    ? "Business"
                    : ""}
                </p>
              </div>

              <p className="emphasis">{deptPrice}$</p>
            </div>

            <div className="booking-flight">
              <div className="trip-flex-col">
                <p className="emphasis">
                  {arrFlight?.DepartureDate} {" > "} {arrFlight?.ArrivalDate}
                </p>
                <p>
                  {arrFlight?.DepartureTime} {">"} {arrFlight?.ArrivalTime}
                </p>
              </div>

              <div className="trip-flex-col">
                <div className="emphasis">
                  <AirlineSeatReclineNormalIcon />
                  {arrSeatNames}
                </div>
                <p style={{ width: "12", textAlign: "center" }}>
                  {arrCabin === "FirstClassSeats"
                    ? "FirstClass"
                    : arrCabin === "EconomySeats"
                    ? "Economy"
                    : arrCabin === "BusinessSeats"
                    ? "Business"
                    : ""}
                </p>
              </div>

              <p className="emphasis">{retPrice}$</p>
            </div>
          </div>
          <div className="vl"></div>
          <div className="trip-flex-col" style={{ width: "30%" }}>
            <h3>{totalPrice}$</h3>
            {!localStorage.getItem("token") ? (
              <Button
                onClick={handleSignInModal}
                style={{
                  backgroundColor: "#447fcc",
                  width: "170px",
                  height: "5vh",
                  fontSize: "small",
                }}
                variant="contained"
              >
                Reserve
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="my-modal"
        centered
        show={showSignin}
        onHide={handleSignInModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "600" }}>Sign In</Modal.Title>
        </Modal.Header>

        <div className="signup-form">
          <Signin />
        </div>
      </Modal>
    </>
  );
};

export default ConfirmBooking;