import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import các components
import MemberDashBoard from "./pages/MemberPages/Home";
import Login from "./pages/MemberPages/Login";
import Register from "./pages/MemberPages/Register";
import MemberHomePage from "./pages/MemberPages/MemberHomePage";
import MemberProfile from "./pages/MemberPages/MemberProfile";
import ChangePassword from "./pages/MemberPages/ChangePassword";
import Feedback from "./pages/MemberPages/Feedback";
import RegisterPackage from "./pages/MemberPages/RegisterPackage";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Member Routes */}
          <Route path="/homepage" element={<MemberDashBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/member/home" element={<MemberHomePage />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/change-password" element={<ChangePassword />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* Receptionist Routes */}
          {/* Thêm các routes cho Receptionist sau khi có components */}
          <Route path="/packages" element={<RegisterPackage />} />
          {/* Default Route */}
          <Route path="/" element={<MemberDashBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
