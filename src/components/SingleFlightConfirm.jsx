import React from "react";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import "../style/EditFlight.css";

const SingleFlightConfirm = ({
  departureDate,
  arrivalDate,
  departureTime,
  arrivalTime,
  seat,
  cabin,
  price,
}) => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleConfirmBooking = () => {
    // Logic for confirming the booking, like making API requests or navigating to a confirmation page
    navigate("/confirmation"); // Replace "/confirmation" with the appropriate route after booking
  };

  return (
    <div>
      <div className="flex-col">
        <div className="single-confirm">
          <div style={{ width: "70%", marginTop: "5px" }}>
            <div className="booking-flight">
              <div className="trip-flex-col">
                <p className="emphasis">
                  {departureDate}
                  {" >"}
                  {arrivalDate}{" "}
                </p>
                <p>
                  {departureTime}
                  {">"}
                  {arrivalTime}
                </p>
              </div>

              <div className="trip-flex-col">
                <div className="emphasis">
                  <AirlineSeatReclineNormalIcon />
                  {seat}
                </div>
                <p style={{ width: "12", textAlign: "center" }}>
                  {cabin === "EconomySeats"
                    ? "Economy"
                    : cabin === "BusinessSeats"
                    ? "Business Class"
                    : "First Class"}
                </p>
              </div>
            </div>
          </div>
          <div className="vl"></div>
          <div className="trip-flex-col" style={{ width: "30%" }}>
            <h3>{price}$</h3>
            <Button
              style={{
                backgroundColor: "#447fcc",
                width: "170px",
                height: "5vh",
                fontSize: "small",
              }}
              variant="contained"
              onClick={handleConfirmBooking} // Call handleConfirmBooking on button click
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFlightConfirm;
