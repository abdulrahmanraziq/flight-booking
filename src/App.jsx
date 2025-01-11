import { Route, Routes } from "react-router-dom"; // Update to use Routes and Route with element
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import ConfirmBooking from "./pages/ConfirmBooking";
import SignInPage from "./pages/SignInPage";
import ChooseSeats from "./pages/ChooseSeats";
import Tagline from "./pages/Tagline";
import StepperPage from "./components/StepperPage";
import Reservation from "./pages/Reservation";
import EditDeparture from "./pages/EditDeparture";
import Payment from "./components/Payment";
import Test from "./pages/Test";
import SignUp from "./components/SignUp";
import './style/App.css';

function App() {
  return (
    <div className="App">
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Tagline />} /> {/* Use element prop for Route */}
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/confirm" element={<ConfirmBooking />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/seats" element={<ChooseSeats />} />
        <Route path="/search" element={<Home />} />
        <Route path="/reserve" element={<Reservation />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/editDep" element={<EditDeparture />} />
        <Route path="/editRet" element={<EditDeparture />} />
      </Routes>
    </div>
  );
}

export default App;