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
import SchedulePage from './pages/MemberPages/SchedulePage';
import RegisterPackage from "./pages/MemberPages/RegisterPackage";
import TrainerHome from './pages/TrainerPages/TrainerHome';
import TrainerMembersList from './pages/TrainerPages/TrainerMembersList';
import TrainerProfileEdit from './pages/TrainerPages/TrainerProfileEdit';

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
          <Route path="/schedule" element={<SchedulePage />} />
          {/* Receptionist Routes */}
          {/* Thêm các routes cho Receptionist sau khi có components */}
          <Route path="/packages" element={<RegisterPackage />} />
          {/* Default Route */}
          <Route path="/" element={<MemberDashBoard />} />
          <Route path="/trainer/home" element={<TrainerHome />}>
            <Route index element={<div>Welcome Trainer Home</div>} />
            <Route path="members" element={<TrainerMembersList />} />
            <Route path="profile/edit" element={<TrainerProfileEdit />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
