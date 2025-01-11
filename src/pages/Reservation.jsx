import React, { useState, useEffect } from "react";
import MyHeader from "../components/MyHeader";
import "../style/seats.css";
import { Stepper, StepContent, StepLabel, Step } from "@mui/material";
import HorizontalLinearStepper from "../components/HorizontalLinearStepper";
import ChooseSeats from "./ChooseSeats";
import ConfirmBooking from "./ConfirmBooking";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import api from "../api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Payment from "../components/Payment";
import DatePicker from "react-datepicker";
import PassengersInfo from "../components/PassengersInfo";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom"; // Using useNavigate

const steps = [
  "Flight Details",
  "Seat Selection",
  "Passenger Information",
  "Payment",
];

const Reservation = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [resId, setResId] = useState("");
  const [deptSeats, setDeptSeats] = useState([]);
  const [arrSeats, setArrSeats] = useState([]);
  const [seatsWarningModal, setSeatsWarningModal] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup session storage when component unmounts
      sessionStorage.removeItem("deptSeats");
      sessionStorage.removeItem("arrSeats");
      sessionStorage.removeItem("passengersInfo");
      sessionStorage.removeItem("deal");
    };
  }, []);

  const handleModalShow = () => {
    if (showModal) {
      setShowModal(false);
      navigate("/bookings"); // Use navigate to change route
    } else {
      setShowModal(true);
    }
  };

  const handleSeatWarningShow = () => {
    setSeatsWarningModal((prev) => !prev);
  };

  const handleSeatsConfirm = (deptSeats, arrSeats) => {
    setDeptSeats(deptSeats);
    setArrSeats(arrSeats);
  };

  const handleConfirm = async () => {
    const userId = localStorage.getItem("userId");
    const { deptFlight, arrFlight, deptCabin, arrCabin, totalPrice } =
      JSON.parse(sessionStorage.getItem("deal"));
    let arrOne = deptSeats.map((s) => ({
      FlightId: deptFlight._id,
      CabinClass: deptCabin === "FirstClassSeats" ? "FirstClass" : deptCabin === "EconomySeats" ? "Economy" : deptCabin === "BusinessSeats" ? "Business" : "",
      ChosenSeat: s.Seat,
    }));

    let arrTwo = arrSeats.map((s) => ({
      FlightId: arrFlight._id,
      CabinClass: arrCabin === "FirstClassSeats" ? "FirstClass" : arrCabin === "EconomySeats" ? "Economy" : arrCabin === "BusinessSeats" ? "Business" : "",
      ChosenSeat: s.Seat,
    }));

    let newArr = arrOne.concat(arrTwo);
    const reservation = {
      UserId: userId,
      TotalPrice: totalPrice,
      Reservation: newArr,
    };

    const response = await api.confirmFlight(reservation);
    setResId(response.data.data);
    handleModalShow();
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    if (activeStep === 1) {
      // Seat selection
      const { adults, children } = JSON.parse(sessionStorage.getItem("deal"));
      if (arrSeats.length < Number(adults) + Number(children) || deptSeats.length < Number(adults) + Number(children)) {
        setSeatsWarningModal(true);
      } else {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
        setActiveStep((prevStep) => prevStep + 1);
        setSkipped(newSkipped);
      }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevStep) => prevStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    const newSkipped = new Set(skipped.values());
    newSkipped.add(activeStep);
    setActiveStep((prevStep) => prevStep + 1);
    setSkipped(newSkipped);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const deal = sessionStorage.getItem("deal")
  const { deptFlight, arrFlight, deptCabin, arrCabin, totalPrice } =
    JSON.parse(deal || "{}");

  return (
    <>
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.575)" }}>
        <MyHeader />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} style={{ backgroundColor: "#edf0f0", padding: "15px", marginTop: "0" }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Handle the steps content */}
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 ? (
                <ConfirmBooking
                  className="slide-left"
                  parentFunc={() => setActiveStep(1)}
                  deptSeats={deptSeats}
                  arrSeats={arrSeats}
                  totalPrice={totalPrice}
                />
              ) : activeStep === 1 ? (
                <ChooseSeats
                  deptFlight={deptFlight}
                  arrFlight={arrFlight}
                  deptCabin={deptCabin}
                  arrCabin={arrCabin}
                  parentFunc={(deptSeats, arrSeats) => handleSeatsConfirm(deptSeats, arrSeats)}
                />
              ) : activeStep === 2 ? (
                <PassengersInfo single={false} />
              ) : (
                <Payment single={false} name={"Flight-depot"} description={"flight from CAI to LAX "} amount={2191} />
              )}

              <div style={{ display: "flex", justifyContent: "space-around", margin: "0 4%" }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack}>
                  <ArrowBackIosNewIcon />
                  Back
                </Button>
                <Button disabled={!localStorage.getItem("token")} onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  <ArrowForwardIosIcon />
                </Button>
              </div>
            </React.Fragment>
          )}
        </Box>

        <Modal centered show={showModal} onHide={handleModalShow}>
          <Modal.Header closeButton style={{ backgroundColor: "#14279b" }}>
            <Modal.Title style={{ color: "white" }}>Successfully Booked!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              Your flight has been booked!<br />
              Confirmation number: <strong>{resId}</strong>
            </h5>
          </Modal.Body>
        </Modal>

        <Modal centered show={seatsWarningModal} onHide={handleSeatWarningShow}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: "600" }}>Heads up!</Modal.Title>
          </Modal.Header>
          <Modal.Body>You must choose all seats to continue.</Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Reservation;