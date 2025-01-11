import React, { useState, useEffect } from "react";
import Trip from "../components/Trip";
import MyHeader from "../components/MyHeader";
import NoResults from "../components/NoResults";
import api from "../api";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Home = () => {
  const [flightArr, setFlightArr] = useState([]);
  const [deptAirport, setDeptAirport] = useState("");
  const [arrAirport, setArrAirport] = useState("");
  const [deptDate, setDeptDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [empty, setEmpty] = useState(false);
  const [tripArr, setTripArr] = useState([]);
  const [userId, setUserId] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const flights = await api.getAllFlights();
        console.log(flights)
        setFlightArr(flights.data);
        
        const searchObject = JSON.parse(sessionStorage.getItem("searchQuery"));
        if (searchObject) {
          const { adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, cabinClass } = searchObject;
          handleSearch(adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, cabinClass);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
  }, []);

  const emptySearch = (adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, cabinClass) => {
    return !adultCount || !deptAirport || !arrAirport || !deptDate || !retDate || !cabinClass;
  };

  const handleSearch = (adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, cabinClass) => {
    if (emptySearch(adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, cabinClass)) {
      alert("Search fields cannot be empty");
      setEmpty(true);
    } else {
      setDeptAirport(deptAirport);
      setArrAirport(arrAirport);
      setDeptDate(deptDate);
      setRetDate(retDate);

      const deptCabin = cabinClass;
      const arrCabin = cabinClass;
      const adultCountValue = adultCount;
      const childCountValue = childCount;

      let resultArr = [];
      for (let i = 0; i < flightArr.length; i++) {
        for (let j = 0; j < flightArr.length; j++) {
          if (
            flightArr[i].DepartureAirport === flightArr[j].ArrivalAirport &&
            flightArr[i].ArrivalAirport === flightArr[j].DepartureAirport &&
            Date.parse(flightArr[i].ArrivalDate) < Date.parse(flightArr[j].DepartureDate)
          ) {
            resultArr.push([flightArr[i], flightArr[j]]);
          }
        }
      }

      setTripArr(resultArr.filter((pair) =>
        pair[0].DepartureAirport === deptAirport &&
        pair[0].ArrivalAirport === arrAirport &&
        Date.parse(pair[0].DepartureDate) === Date.parse(deptDate) &&
        Date.parse(pair[1].ArrivalDate) === Date.parse(retDate) &&
        pair[0][cabinClass].AvailableSeats >= Number(adultCount) + Number(childCount) &&
        pair[1][cabinClass].AvailableSeats >= Number(adultCount) + Number(childCount)
      ));
      sessionStorage.setItem("searchQuery", null);
    }
  };

  return (
    <div className="flex-col">
      <MyHeader
        userId={userId}
        parentSearch={(adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, deptCabinClass, arrCabinClass) =>
          handleSearch(adultCount, childCount, deptAirport, arrAirport, deptDate, retDate, deptCabinClass, arrCabinClass)
        }
      />

      <div className="trip-search-results">
        {tripArr && tripArr.length > 0 ? (
          tripArr.map((t, index) => (
            <Trip
              key={index}
              deptFlight={t[0]}
              arrFlight={t[1]}
              deptCabin={cabinClass}
              arrCabin={cabinClass}
              adults={adultCount}
              children={childCount}
              userId={userId}
            />
          ))
        ) : (
          <NoResults
            deptAirport={deptAirport}
            arrAirport={arrAirport}
            deptDate={deptDate}
            arrDate={retDate}
          />
        )}
      </div>
    </div>
  );
};

export default Home;