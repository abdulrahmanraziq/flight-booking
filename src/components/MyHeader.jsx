import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "../components/Logo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "../components/ProflieDropdown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../api";
import { Typeahead } from "react-bootstrap-typeahead";

const MyHeader = ({ parentSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    adultCount: 1,
    childCount: 0,
    deptAirport: "",
    arrAirport: "",
    deptDate: "",
    retDate: "",
    cabinClass: "EconomySeats",
    userId: "",
    showSignin: false,
    signedIn: false,
    anchorEl: null,
    open: false,
    token: "",
    username: "",
    anchorElCabinDep: null,
    anchorElCabin: null,
    openCabinDep: false,
    openCabin: false,
    deptOptions: [],
    selectedDepts: [],
    arrOptions: [],
    selectedArrivals: [],
  });

  const {
    adultCount,
    childCount,
    deptAirport,
    arrAirport,
    deptDate,
    retDate,
    cabinClass,
    signedIn,
    open,
    openCabin,
    openCabinDep,
    deptOptions,
    selectedDepts,
    arrOptions,
    selectedArrivals,
  } = state;

  const handleStateChange = (updates) =>
    setState((prevState) => ({ ...prevState, ...updates }));

  const handleClick = (event) => {
    handleStateChange({ anchorEl: event.currentTarget, open: true });
  };

  const handleClose = () => {
    handleStateChange({ anchorEl: null, open: false });
  };

  const handleClickCabinDep = (event) => {
    handleStateChange({
      anchorElCabinDep: event.currentTarget,
      openCabinDep: true,
    });
  };

  const handleCloseCabinDep = () => {
    handleStateChange({ anchorElCabinDep: null, openCabinDep: false });
  };

  const handleMenuItemClick = (event) => {
    const { name, value } = event.target.attributes;
    handleStateChange({
      [name?.value]: value?.value,
    });
    handleCloseCabinDep();
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;
    handleStateChange({ [name]: value });
  };

  const flightSearch = () => {
    const search = {
      adultCount,
      childCount,
      deptAirport,
      arrAirport,
      deptDate,
      retDate,
      cabinClass,
    };

    if (location.pathname === "/search") {
      parentSearch(
        adultCount,
        childCount,
        deptAirport,
        arrAirport,
        deptDate,
        retDate,
        cabinClass
      );
    } else {
      sessionStorage.setItem("searchQuery", JSON.stringify(search));
      navigate("/search");
    }
  };

  const setDepartureSelections = (arr) => {
    handleStateChange({
      selectedDepts: arr,
      deptAirport: arr[0] || "",
    });
  };

  const setArrivalSelections = (arr) => {
    handleStateChange({
      selectedArrivals: arr,
      arrAirport: arr[0] || "",
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        handleStateChange({ signedIn: true, userId, token });

        try {
          const user = await api.getUserInfo(userId);
          handleStateChange({ username: user.data.data.UserName });
        } catch (err) {
          console.error(err);
        }
      }

      try {
        const flights = await api.getAllFlights();
        handleStateChange({
          deptOptions: [
            ...new Set(flights.data.map((f) => f.DepartureAirport)),
          ],
          arrOptions: [...new Set(flights.data.map((f) => f.ArrivalAirport))],
        });
      } catch (err) {
        console.error(err);
      }

      const searchObject = JSON.parse(sessionStorage.getItem("searchQuery"));
      if (searchObject) {
        handleStateChange({ ...searchObject });
      }
    };

    initializeData();
  }, []);

  return (
    <div className="admin-header logo-buttons-search">
      <div className="logo-buttons">
        <Link
          style={{ textDecoration: "none", color: "white", cursor: "pointer" }}
          to="/"
        >
          <Logo />
        </Link>
        <div className="header-buttons-container">
          {signedIn ? (
            <ProfileDropdown
              ParentRedirect={() => navigate("/")}
              username={state.username}
            />
          ) : (
            <Button
              className="header-buttons"
              onClick={() => navigate("/signin")}
              variant="contained"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      <div className="search-bar">
        {/* Passenger Count */}
        <Button onClick={handleClick} style={{ color: "white" }}>
          {`${Number(childCount) + Number(adultCount)} Passengers`}
          <KeyboardArrowDownIcon />
        </Button>
        <Menu anchorEl={state.anchorEl} open={open} onClose={handleClose}>
          <MenuItem>
            <TextField
              label="Adults"
              type="number"
              value={adultCount}
              name="adultCount"
              onChange={handleSearch}
            />
          </MenuItem>
          <MenuItem>
            <TextField
              label="Children"
              type="number"
              value={childCount}
              name="childCount"
              onChange={handleSearch}
            />
          </MenuItem>
        </Menu>

        {/* Cabin Class */}
        <Button onClick={handleClickCabinDep} style={{ color: "white" }}>
          {cabinClass === "EconomySeats" ? "Economy" : cabinClass}
          <KeyboardArrowDownIcon />
        </Button>
        <Menu
          anchorEl={state.anchorElCabinDep}
          open={openCabinDep}
          onClose={handleCloseCabinDep}
        >
          {["EconomySeats", "BusinessSeats", "FirstClassSeats"].map((cabin) => (
            <MenuItem
              key={cabin}
              name="cabinClass"
              value={cabin}
              onClick={handleMenuItemClick}
            >
              {cabin.replace("Seats", "")}
            </MenuItem>
          ))}
        </Menu>

        {/* Typeahead Inputs */}
        <Typeahead
          id="deptDropDown"
          onChange={setDepartureSelections}
          options={deptOptions}
          placeholder="Departure airport"
          selected={selectedDepts}
        />
        <Typeahead
          id="arrDropDown"
          onChange={setArrivalSelections}
          options={arrOptions}
          placeholder="Arrival airport"
          selected={selectedArrivals}
        />

        {/* Date Inputs */}
        <Form.Control
          type="text"
          placeholder="Departure date"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          value={deptDate}
          name="deptDate"
          onChange={handleSearch}
        />
        <Form.Control
          type="text"
          placeholder="Return date"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          value={retDate}
          name="retDate"
          onChange={handleSearch}
        />

        {/* Search Button */}
        <Button onClick={flightSearch} variant="contained">
          <SearchIcon /> Search
        </Button>
      </div>
    </div>
  );
};

export default MyHeader;
