import React, { useState, useEffect } from "react";
import MyHeader from "../components/MyHeader";
import BookingReservation from "../components/BookingReservation";
import api from "../api";
import Button from "@mui/material/Button";
import "../style/booking.css";
import "../style/trip.css";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const MyBookings = () => {
  const [bookingsArr, setBookingsArr] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle modal show
  const handleModalShow = (confirmation) => {
    setShowModal(!showModal);
    setConfirmation(confirmation);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Function to handle deletion of booking
  const handleDelete = async () => {
    try {
      await api.deleteReservationById(confirmation);
      console.log("Deleted booking with confirmation: ", confirmation);
      handleModalClose();
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  // Custom filter function
  const customFilter = (arr, id) => {
    let newArr = [];
    for (let i = 0; i < arr.length / 2; i++) {
      let j = i + arr.length / 2;
      newArr.push({
        PassengerFirstName: arr[i].PassengerFirstName,
        PassengerLastName: arr[i].PassengerLastName,
        PassengerPassportNumber: arr[i].PassengerPassportNumber,
        PassengerType: arr[i].PassengerType,
        DepFlight: arr[i].FlightId,
        DepSeat: arr[i].ChosenSeat,
        DepCabin: arr[i].CabinClass,
        ArrFlight: arr[j].FlightId,
        ArrSeat: arr[j].ChosenSeat,
        ArrCabin: arr[j].CabinClass,
        id: id,
      });
    }
    return newArr;
  };

  // Fetch user's bookings after the component mounts
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/"); // Navigate to home if no userId is found
    } else {
      console.log("user id in bookinggg", userId);
      const fetchBookings = async () => {
        try {
          const reservations = await api.getReservationsById(userId);
          let arr = reservations.data.data;
          arr.forEach((reservation) => {
            console.log("Filtered reservations:", customFilter(reservation.Reservation));
          });
          setBookingsArr(reservations.data.data);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };
      fetchBookings();
    }
  }, [navigate]); // Dependency array ensures effect is triggered only once when component mounts

  return (
    <>
      <div className="flex-col">
        <MyHeader />
        <div className="trip-search-results">
          {bookingsArr
            ? bookingsArr.map((b) => <BookingReservation key={b.id} b={b} />)
            : ""}
        </div>
      </div>

      {/* Modal for booking deletion confirmation */}
      <Modal
        centered
        show={showModal}
        onHide={handleModalClose}
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "600" }}>Heads up!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            style={{ color: "red" }}
            onClick={handleDelete}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyBookings;