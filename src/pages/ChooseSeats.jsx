import React, { useState, useEffect } from "react";
import MyHeader from "../components/MyHeader";
import Seats from "../components/Seats";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const ChooseSeats = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [arrSeats, setArrSeats] = useState(
    JSON.parse(sessionStorage.getItem("arrSeats")) || []
  );
  const [deptSeats, setDeptSeats] = useState(
    JSON.parse(sessionStorage.getItem("deptSeats")) || []
  );

  useEffect(() => {
    // If any change occurs in sessionStorage, update the state
    const updatedArrSeats =
      JSON.parse(sessionStorage.getItem("arrSeats")) || [];
    const updatedDeptSeats =
      JSON.parse(sessionStorage.getItem("deptSeats")) || [];

    setArrSeats(updatedArrSeats);
    setDeptSeats(updatedDeptSeats);
  }, []);

  const handleConfirm = () => {
    const { adults, children } = JSON.parse(sessionStorage.getItem("deal"));
    // Call the parent function with the selected seats
    // this.props.parentFunc(deptSeats, arrSeats);
    // Make sure `parentFunc` is passed down as a prop in a functional way.
  };

  const handleSeatsChange = (att, seats) => {
    sessionStorage.setItem(att, JSON.stringify(seats));
    if (att === "deptSeats") {
      setDeptSeats(seats);
    } else if (att === "arrSeats") {
      setArrSeats(seats);
    }
    // Call the parent function with the updated state
    // this.props.parentFunc(deptSeats, arrSeats);
  };

  const deals = sessionStorage.getItem("deal");
  const { deptFlight, arrFlight, deptCabin, arrCabin, adults, children } =
    JSON.parse(deals || "{}");

  return (
    <div className="seats-page slide-left">
      <div className="shuttles">
        {deptFlight && deptFlight[deptCabin] && deptFlight[deptCabin].Seats && (
          <Seats
            preChosen={deptSeats}
            parentFunc={(att, seats) => handleSeatsChange(att, seats)}
            seats={deptFlight[deptCabin].Seats}
            att="deptSeats"
            type="Departure flight"
            seatClass={deptCabin}
            passengers={Number(adults) + Number(children)}
          />
        )}
        {arrFlight && arrFlight[arrCabin] && arrFlight[arrCabin].Seats && (
          <Seats
            preChosen={arrSeats}
            parentFunc={(att, seats) => handleSeatsChange(att, seats)}
            seats={arrFlight[arrCabin].Seats}
            att="arrSeats"
            type="Return flight"
            seatClass={arrCabin}
            passengers={Number(adults) + Number(children)}
          />
        )}
      </div>
    </div>
  );
};

export default ChooseSeats;
