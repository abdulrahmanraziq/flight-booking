import React, { useState, useEffect } from "react";
import SingleFlight from "../components/SingleFlight";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import SearchIcon from "@mui/icons-material/Search";
import NoResults from "../components/NoResults";
import "../style/EditFlight.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyHeader from "../components/MyHeader";
import { Stepper, StepContent, StepLabel, Step } from "@mui/material";
import SingleFlightConfirm from "../components/SingleFlightConfirm";
import api from "../api";
import ConfirmBooking from "./ConfirmBooking";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Payment from "../components/Payment";
import PassengersInfo from "../components/PassengersInfo";
import SingleSeats from "../components/SingleSeats";
import { useNavigate, useLocation  } from 'react-router-dom';


const steps = ["Search", "Seats", "Passenger Info", "Payment"];

const EditDeparture = () => {
    const [state, setState] = useState({
        flightsArr: [],
        searchResults: [],
        depDateSearch: "",
        cabinSearch: "EconomySeats",
        searchFlight: "",
        date: "",
        departureFlag: false,
        clickedSearch: false,
        minDate: "",
        maxDate: "",
        activeStep: 0,
        skipped: new Set(),
        editReservation: {},
        editFlight: "",
        chosenSeats: [],
        seatsWarningModal: false,
      });
    
      const navigate = useNavigate();
      const location = useLocation();
    
      const deptTrip = {
        // Example of deptTrip data, make sure to use your actual data
        FlightNumber: "1175",
        DepartureTime: "10:10",
        ArrivalTime: "12:10",
        DepartureDate: "2021-12-09",
        ArrivalDate: "2021-12-10",
        EconomySeats: {
          AvailableSeats: 20,
          PriceAdult: 1000,
          PriceChild: 700,
          Seats: [
            { Seat: "A1", Reserved: true },
            { Seat: "A2", Reserved: true },
            { Seat: "A3", Reserved: true },
          ],
          BaggageAllowance: { Number: 4, Size: 20 },
        },
        BusinessSeats: {
          AvailableSeats: 20,
          PriceAdult: 1500,
          PriceChild: 850,
          Seats: [
            { Seat: "B1", Reserved: true },
            { Seat: "B2", Reserved: true },
            { Seat: "B3", Reserved: true },
          ],
          BaggageAllowance: { Number: 4, Size: 20 },
        },
        FirstClassSeats: {
          AvailableSeats: 20,
          PriceAdult: 2000,
          PriceChild: 700,
          Seats: [
            { Seat: "C1", Reserved: true },
            { Seat: "C2", Reserved: true },
            { Seat: "C3", Reserved: true },
          ],
          BaggageAllowance: { Number: 4, Size: 20 },
        },
        DepartureTerminal: 10,
        ArrivalTerminal: 15,
        DepartureAirport: "LXR",
        ArrivalAirport: "CAI",
        TripDuration: "24h 30m",
      };
    
      useEffect(() => {
        const fetchFlights = async () => {
          const editReservation = JSON.parse(sessionStorage.getItem("editReservation"));
          console.log("The reservation I am editing: ", editReservation);
          await api.getAllFlights().then((flights) => {
            console.log("Flights fetched from DB: ", flights.data);
            setState((prevState) => ({
              ...prevState,
              flightsArr: flights.data,
              editReservation: editReservation,
            }));
          });
        };
        fetchFlights();
    
        if (location.pathname === "/editDep") {
          const depFlight = JSON.parse(sessionStorage.getItem("depFlight"));
          const retFlight = JSON.parse(sessionStorage.getItem("retFlight"));
          setState((prevState) => ({
            ...prevState,
            searchFlight: depFlight,
            date: retFlight.DepartureDate,
            departureFlag: true,
            depDateSearch: depFlight.DepartureDate,
            minDate: new Date().toISOString().substring(0, 10),
            maxDate: retFlight.DepartureDate,
          }));
        } else {
          const retFlight = JSON.parse(sessionStorage.getItem("retFlight"));
          const depFlight = JSON.parse(sessionStorage.getItem("depFlight"));
          setState((prevState) => ({
            ...prevState,
            searchFlight: retFlight,
            date: depFlight.ArrivalDate,
            depDateSearch: retFlight.DepartureDate,
            minDate: depFlight.ArrivalDate,
            departureFlag: false,
          }));
        }
      }, [location.pathname]);
    
      const handleSearch = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
    
      const andSearch = () => {
        const { flightsArr, depDateSearch, cabinSearch, searchFlight, date } = state;
    
        if (state.departureFlag) {
          setState((prevState) => ({
            ...prevState,
            searchResults: flightsArr.filter(
              (f) =>
                Date.parse(f.DepartureDate) === Date.parse(depDateSearch) &&
                f.DepartureAirport === searchFlight.DepartureAirport &&
                f.ArrivalAirport === searchFlight.ArrivalAirport &&
                f[cabinSearch]["AvailableSeats"] >= 1 &&
                Date.parse(f.ArrivalDate) < Date.parse(date)
            ),
            clickedSearch: true,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            searchResults: flightsArr.filter(
              (f) =>
                Date.parse(f.DepartureDate) === Date.parse(depDateSearch) &&
                f.DepartureAirport === searchFlight.DepartureAirport &&
                f.ArrivalAirport === searchFlight.ArrivalAirport &&
                f[cabinSearch]["AvailableSeats"] >= 1 &&
                Date.parse(f.DepartureDate) > Date.parse(date)
            ),
            clickedSearch: true,
          }));
        }
    
        sessionStorage.setItem("cabinSearch", cabinSearch);
      };
    
      const handleConfirmFlight = (flight) => {
        sessionStorage.setItem("newFlight", JSON.stringify(flight));
        const editReservation = JSON.parse(sessionStorage.getItem("editReservation"));
        let passengersInfo = [];
    
        if (editReservation) {
          let info = {
            firstName: editReservation.PassengerFirstName,
            lastName: editReservation.PassengerLastName,
            type: editReservation.PassengerType,
            passport: editReservation.PassengerPassportNumber,
          };
          passengersInfo.push(info);
        }
        sessionStorage.setItem("passengersInfo", JSON.stringify(passengersInfo));
        setState((prevState) => ({
          ...prevState,
          editFlight: flight,
          activeStep: 1,
        }));
      };
    
      const handleNext = () => {
        const { activeStep, skipped, chosenSeats, seatsWarningModal } = state;
    
        if (activeStep === 1) {
          if (chosenSeats.length === 0) {
            alert("You must choose all seats.");
            setState((prevState) => ({
              ...prevState,
              seatsWarningModal: true,
            }));
          } else {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
              newSkipped = new Set(newSkipped.values());
              newSkipped.delete(activeStep);
            }
            setState((prevState) => ({
              ...prevState,
              activeStep: prevState.activeStep + 1,
              skipped: newSkipped,
            }));
          }
        } else if (activeStep === 2) {
          handleFinalChange();
        } else {
          let newSkipped = skipped;
          if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
          }
          setState((prevState) => ({
            ...prevState,
            activeStep: prevState.activeStep + 1,
            skipped: newSkipped,
          }));
        }
      };
    
      const handleFinalChange = async () => {
        const reservation = JSON.parse(sessionStorage.getItem("editReservation"));
        const oldFlight = JSON.parse(sessionStorage.getItem("oldFlight"));
        const newFlight = JSON.parse(sessionStorage.getItem("newFlight"));
        const seats = JSON.parse(sessionStorage.getItem("chosenSeats"));
        const passengersInfo = JSON.parse(sessionStorage.getItem("passengersInfo"));
        const oldCabin = sessionStorage.getItem("oldCabin");
        const newCabin = sessionStorage.getItem("cabinSearch");
    
        const updateFlight = {
          OldFlightId: oldFlight._id,
          OldChosenSeat: sessionStorage.getItem("oldSeat"),
          OldCabinClass: oldCabin,
          NewFlightId: newFlight._id,
          NewChosenSeat: seats[0].Seat,
          NewCabinClass: newCabin === "EconomySeats"
            ? "Economy"
            : newCabin === "BusinessSeats"
            ? "Business"
            : newCabin === "FirstClassSeats"
            ? "FirstClass"
            : "",
          PassengerFirstName: passengersInfo[0].firstName,
          PassengerLastName: passengersInfo[0].lastName,
          PassengerType: passengersInfo[0].type,
          PassengerPassportNumber: passengersInfo[0].passport,
        };
    
        await api.editReservation(reservation.id, updateFlight).then(() => {
          navigate("/bookings");
        });
      };
    
      const handleBack = () => {
        setState((prevState) => ({
          ...prevState,
          activeStep: prevState.activeStep - 1,
        }));
      };
    
      const handleReset = () => {
        setState((prevState) => ({
          ...prevState,
          activeStep: 0,
        }));
      };
    
      const isStepSkipped = (step) => skipped.has(step);  return (
      <>
        <div className="flex-col" style={{ gap: "0" }}>
          <MyHeader />
          {/* <SingleFlightConfirm departureDate={"02-12-2021"} arrivalDate={"18-12-2021"} departureTime={"03:10"} arrivalTime={"03:10"} seat={"A1"} cabin={"EconomySeats"} price={"112"} /> */}

          <Box sx={{ width: "100%" }}>
            <Stepper
              activeStep={activeStep}
              style={{
                backgroundColor: "#edf0f0",
                height: "auto",
                padding: "15px",
                paddingLeft: "4.5%",
                paddingRight: "4.5%",
                marginTop: "0",
              }}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel
                      style={{ marginTop: "0px !important", color: "white" }}
                      {...labelProps}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                {activeStep == 0 ? (
                  <div style={{ height: "59vh" }}>
                    {/* your div of choice here  */}

                    {/* //search */}
                    <div className="flex-col">
                      <div
                        className="search-bar-box"
                        style={{ justifyContent: "center" }}
                      >
                        <Form.Group style={{ width: "40%" }} className="mb-2">
                          <Form.Label
                            style={{ fontWeight: "600" }}
                            className="mb-0"
                          >
                            Departure Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            placeholder="Departure date"
                            value={depDateSearch}
                            name="depDateSearch"
                            onChange={this.handleSearch.bind(this)}
                            min={this.state.minDate}
                            max={this.state.maxDate}
                            // maxDate={new Date("12-12-2021")}
                          />
                        </Form.Group>
                        <Form.Group style={{ width: "40%" }} className="mb-2">
                          <Form.Label
                            style={{ fontWeight: "600" }}
                            className="mb-0"
                          >
                            Cabin Class
                          </Form.Label>
                          <Form.Select
                            value={cabinSearch}
                            name="cabinSearch"
                            onChange={this.handleSearch.bind(this)}
                            aria-label="Default select example"
                          >
                            <option hidden>Departure cabin </option>
                            <option value="EconomySeats">Economy</option>
                            <option value="BusinessSeats">
                              Business class
                            </option>
                            <option value="FirstClassSeats">First Class</option>
                          </Form.Select>
                        </Form.Group>
                        <div>
                          <Button
                            style={{
                              width: "auto",
                              height: "37px",
                              marginTop: "18px",
                              padding: "1rem",
                            }}
                            onClick={this.andSearch.bind(this)}
                            variant="contained"
                          >
                            <SearchIcon style={{ fontSize: "30px" }} />{" "}
                          </Button>
                        </div>
                      </div>

                      <div className="flex-col edit-box">
                        {searchResults.length > 0 ? (
                          searchResults.map((t) => (
                            <SingleFlight
                              parentFunc={(flight) =>
                                this.handleConfirmFlight(flight)
                              }
                              flight={t}
                            />
                          ))
                        ) : clickedSearch ? (
                          <>
                            <div className="flex-col no-res">
                              <SearchIcon style={{ fontSize: "5rem" }} />
                              <h2>
                                Sorry, we couldn't find any flights from{" "}
                                {searchFlight.DepartureAirport} to{" "}
                                {searchFlight.ArrivalAirport} on {depDateSearch}
                              </h2>
                              <h6 style={{ color: "grey" }}>
                                These airports may not have regularly scheduled
                                flights or there may be restrictions that impact
                                this route.
                              </h6>
                            </div>
                          </>
                        ) : (
                          <div className="flex-col no-res">
                            <SearchIcon style={{ fontSize: "5rem" }} />
                            <h2>Search to find your ideal flight</h2>
                            <h6 style={{ color: "grey" }}>
                              airports may not have regularly scheduled flights
                              or there may be restrictions that impact this
                              route.
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : activeStep == 1 ? (
                  <div className="flex-col">
                    <SingleSeats
                      preChosen={[]}
                      parentFunc={(att, seats) =>
                        this.handleSeatsChange(att, seats)
                      }
                      seats={this.state.editFlight.EconomySeats.Seats}
                      att="chosenSeats"
                      type={
                        this.state.departureFlag
                          ? "Departure flight"
                          : "Return Flight"
                      }
                      seatClass={this.state.cabinSearch}
                      passengers={1}
                    />
                  </div>
                ) : activeStep == 2 ? (
                  <div style={{ height: "59vh" }}>
                    <div className="flex-col" style={{ marginTop: "1em" }}>
                      <PassengersInfo single={true} />
                    </div>
                  </div>
                ) : activeStep == 3 ? (
                  <div
                    style={{
                      height: "59vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Payment
                      single={true}
                      name={"Flight-depot"}
                      description={"flight"}
                      amount={this.state.editReservation.TotalPrice}
                    />
                  </div>
                ) : (
                  <div style={{ height: "59vh" }}>
                    <h1>"ssssssssssssssssss"</h1>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    color: "white",
                    marginRight: "4%",
                    marginLeft: "4%",
                  }}
                >
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIosNewIcon />
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {}

                  {this.state.activeStep === 3 ? (
                    <Payment
                      single={true}
                      name={"Flight-depot"}
                      description={"flight  "}
                      amount={this.state.editReservation.TotalPrice}
                    />
                  ) : (
                    <Button
                      disabled={!localStorage.getItem("token") ? true : false}
                      onClick={handleNext}
                      style={{ color: "white" }}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}{" "}
                      <ArrowForwardIosIcon />
                    </Button>
                  )}
                </div>
              </React.Fragment>
            )}
          </Box>
        </div>

        <Modal
          centered
          show={this.state.seatsWarningModal}
          onHide={this.handleModalShow.bind(this)}
          dialogClassName="my-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: "600" }}>Heads up!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>You must choose all seats to continue</Modal.Body>
        </Modal>
      </>
    );
  }
export default EditDeparture;
